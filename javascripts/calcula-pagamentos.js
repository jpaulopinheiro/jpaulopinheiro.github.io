$(function() {
	moment.locale('pt-BR');
	//setar data atual em $("#data-venda")
    //$("#botao-calcular").click(calcularDatas);
	$("#botao-calcular").click(calcular);
    $("#botao-limpar").click(limpar);
    $("#tipo-cartao").change(habilitarParcelamento);
    $("#botao-limpar").prop( "disabled", true );
    $("#tabela-resultados").hide();
});

function calcular(){
	var dataVenda = moment($("#data-venda").val());
	var valorVenda = $("#valor-venda").val();
	var tipoCartao = $("#tipo-cartao").val();
	var bandeiraCartao = $("#bandeira-cartao").val();
	var numeroParcelas = parseInt(obterNumeroParcelas(tipoCartao));
	
	var datas = calcularDatas(dataVenda, tipoCartao, bandeiraCartao, numeroParcelas);
	var valores = calcularValores(valorVenda, tipoCartao, bandeiraCartao, numeroParcelas);
	
	montarTabelaResultados(numeroParcelas, datas, valores);	

	desabilitarCamposAposCalculo();
	$("#botao-limpar").focus();
	$("#tabela-resultados").show();

}

function desabilitarCamposAposCalculo(){
	$("#data-venda").prop( "disabled", true );
	$("#valor-venda").prop( "disabled", true );
	$("#tipo-cartao").prop( "disabled", true );
	$("#bandeira-cartao").prop( "disabled", true );
	$("#numero-parcelas").prop( "disabled", true );
	$("#botao-calcular").prop( "disabled", true );
	$("#botao-limpar").prop( "disabled", false );
}

function habilitarCamposParaCalculo(){
	$("#data-venda").prop( "disabled", false );
	$("#valor-venda").prop( "disabled", false );
	$("#tipo-cartao").prop( "disabled", false );
	$("#bandeira-cartao").prop( "disabled", false );
	$("#numero-parcelas").prop( "disabled", false );
	$("#botao-calcular").prop( "disabled", false );
	$("#botao-limpar").prop( "disabled", true );
}

function obterNumeroParcelas(tipoCartao){
	if(tipoCartao == 2){
		return 1;
	} else return $("#numero-parcelas").val();
}
 
function calcularDatas(dataVenda, tipoCartao, bandeiraCartao, numeroParcelas) {
	var datas;
	// MasterCard
	if(bandeiraCartao == 3){
		datas = calcularDatasMC(dataVenda, numeroParcelas);
	} else {
		datas = calcularDatasVisa(dataVenda, numeroParcelas);		
	}
	
	return datas;
}

function calcularDatasVisa(dataVenda, numeroParcelas){
	var datas = new Array();
	var datasDepositos = calcularDatasDepositosVisa(dataVenda, numeroParcelas);
	for(i=0;i<datasDepositos.length;i++){
		var dataPagamento = datasDepositos[i].add(30, 'days');
		var diaDaSemana = dataPagamento.day();
		while(!ehDiaUtil(diaDaSemana)){
			dataPagamento.add(1, 'days');
			diaDaSemana = dataPagamento.day();
		}
		datas.push(dataPagamento);
	}
	return datas;
}

function calcularDatasDepositosVisa(dataVenda, numeroParcelas){
	var datasDepositos = new Array();
	datasDepositos.push(moment(dataVenda));
	for(i=1;i<numeroParcelas;i++){
		var dataDeposito = dataVenda.clone();
		dataDeposito.add(i, 'months');
		datasDepositos.push(moment(dataDeposito));
	}
	return datasDepositos;
}

function calcularDatasMC(dataVenda, numeroParcelas){
	var datas = new Array();
	var prazo = 30;
	for(i=1;i<=numeroParcelas;i++){
		var dataParcela = dataVenda.clone();
		dataParcela.add(prazo, 'days');
		var diaDaSemana = dataParcela.day();
		while(!ehDiaUtil(diaDaSemana)){
			dataParcela.add(1, 'days');
			diaDaSemana = dataParcela.day();
		}
		datas.push(dataParcela);
		prazo=prazo+30;
	}
	return datas;
}

function limpar() {
	habilitarCamposParaCalculo();
	limparTabelaResultados();
	$("#tabela-resultados").hide();
}

function habilitarParcelamento(){
	var tipoCartao = $("#tipo-cartao").val();
	if(tipoCartao == 1){
		$("#parcelamento").show();
	} else $("#parcelamento").hide();
}

function montarTabelaResultados(numeroParcelas, datas, valores){
	for(i=1;i<=numeroParcelas;i++){
		addLinhaTabelaResultados(i, datas[i-1], parseFloat(valores[i-1].toString()));
	}	
}

function addLinhaTabelaResultados(parcela, data, valor){
    $("#tabela-resultados tbody").append(
    	"<tr>"+
	        "<td>"+ parcela +"</td>"+
	        "<td>"+ data.format('L') +"</td>"+
	        "<td>"+ accounting.formatMoney(valor, "R$", 2, ".", ",") +"</td>"+
        "</tr>");
}

function limparTabelaResultados() {
    $("#tabela-resultados tbody tr").remove();
}

function ehDiaUtil(diaDaSemana){
	// dias nao úteis retornados pelo moment.js [0,6];
	var diasNaoUteis = [0,6];
	if($.inArray(diaDaSemana, diasNaoUteis) == -1){
		return true;
	} else return false;
}

function calcularValores(valorVenda, tipoCartao, bandeiraCartao, numeroParcelas){
	var valores = new Array();
	var valorBruto = Big(valorVenda);
	var valorBrutoParcela = valorBruto.div(numeroParcelas);

	if(tipoCartao == 1){
		if(ehDizimaPeriodica(valorVenda, numeroParcelas)){
			valorBrutoParcela = valorBrutoParcela.round(2,0);
			var ajuste = valorBruto.minus(valorBrutoParcela.times(numeroParcelas));
			var valorBrutoParcela1 = Big(valorBrutoParcela.plus(ajuste));
			var valorLiquidoParcela1 = calcularValorLiquidoParcela(valorBrutoParcela1, tipoCartao, bandeiraCartao, numeroParcelas);
			valores.push(valorLiquidoParcela1);
			var valorLiquidoDemaisParcelas = calcularValorLiquidoParcela(valorBrutoParcela, tipoCartao, bandeiraCartao, numeroParcelas);
			for(i=2;i<=numeroParcelas;i++){
				valores.push(valorLiquidoDemaisParcelas);
			}
		} else {
			var valorLiquidoTodasParcelas = calcularValorLiquidoParcela(valorBrutoParcela, tipoCartao, bandeiraCartao, numeroParcelas);
			for(i=1;i<=numeroParcelas;i++){
				valores.push(valorLiquidoTodasParcelas);
			}		
		}
	} else if(tipoCartao == 2){
		var valorLiquidoParcela = calcularValorLiquidoParcela(valorBrutoParcela, tipoCartao, bandeiraCartao, numeroParcelas);
		valores.push(valorLiquidoParcela);
	}
	return valores;	
}

function calcularValorLiquidoParcela(valorBrutoParcela, tipoCartao, bandeiraCartao, numeroParcelas){
	var fator = Big(new Big(1).minus(obterPercentualDesconto(tipoCartao, bandeiraCartao, numeroParcelas)));
	var float = parseFloat(fator.toString());
	var valorLiquidoParcela = valorBrutoParcela.times(float);
	valorLiquidoParcela = valorLiquidoParcela.round(2,1);
	return valorLiquidoParcela;
}

function obterPercentualDesconto(tipoCartao, bandeiraCartao, numeroParcelas){
	var percentualDesconto;
	if(tipoCartao == 1){
		// cartão de crédito
		switch(numeroParcelas){
			case 1:
				percentualDesconto = new Big(0.036);
				break;
			case 2:
			case 3:
				percentualDesconto = new Big(0.0435);
				break;
			case 4:
			case 5:
			case 6:
				percentualDesconto = new Big(0.046);
				break;
			default:
				percentualDesconto = new Big(0.051);
				break;
		}
	} else if(tipoCartao == 2){
		// cartão de débito	
		percentualDesconto = new Big(0.0245);
	}
	return percentualDesconto;
}

function ehDizimaPeriodica(numerador, denominador){
	var strValor = new Fraction(numerador, denominador).toString();
	if(strValor.indexOf("(") != -1 && strValor.indexOf(")") != -1){
		return true;
	} else return false;	
}