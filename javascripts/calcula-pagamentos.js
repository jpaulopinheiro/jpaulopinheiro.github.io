$(function() {
	moment.locale('pt-BR');
	//setar data atual em $("#data-venda")
    //$("#botao-calcular").click(calcularDatas);
	$("#botao-calcular").click(calcular);
    $("#botao-limpar").click(limpar);
    $("#tipo-cartao").change(habilitarParcelamento);
    $("#botao-limpar").prop( "disabled", true );
    $("#tabela-resultados").hide();
    $("#parcelamento").hide();
});

function calcular(){
	var dataVenda = moment($("#data-venda").val());
	var valorVenda = $("#valor-venda").val();
	var tipoCartao = $("#tipo-cartao").val();
	var bandeiraCartao = $("#bandeira-cartao").val();
	var numeroParcelas = obterNumeroParcelas(tipoCartao);
	
	var datas = calcularDatas(dataVenda, tipoCartao, bandeiraCartao, numeroParcelas);
	var valores = calcularValores(valorVenda, tipoCartao, bandeiraCartao, numeroParcelas);
	
	montarTabelaResultados(numeroParcelas, datas, valores);	

	$("#data-venda").prop( "disabled", true );
	$("#num-parcelas").prop( "disabled", true );
	$("#botao-calcular").prop( "disabled", true );
	$("#botao-limpar").prop( "disabled", false );
	$("#botao-limpar").focus();
	$("#tabela-resultados").show();

}

function obterNumeroParcelas(tipoCartao){
	if(tipoCartao == 2){
		return 1;
	} else return $("#numero-parcelas").val();
}
 
function calcularDatas(dataVenda, tipoCartao, bandeiraCartao, numeroParcelas) {
	var datas = new Array();
	var prazo = 30;
	
	// MasterCard
	if(bandeiraCartao == 3){
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
	}
	
	return datas;
}

function limpar() {
	$("#data-venda").prop( "disabled", false );
	$("#data-venda").focus();
	$("#num-parcelas").prop( "disabled", false );
	$("#botao-calcular").prop( "disabled", false );
	$("#botao-limpar").prop( "disabled", true );
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
		addLinhaTabelaResultados(i, datas[i-1].format('L'), valores[i-1].toString());
	}	
}

function addLinhaTabelaResultados(parcela, data, valor){
    $("#tabela-resultados tbody").append(
    	"<tr>"+
	        "<td>"+ parcela +"</td>"+
	        "<td>"+ data +"</td>"+
	        "<td>"+ valor +"</td>"+
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

	if(ehDizimaPeriodica(valorVenda, numeroParcelas)){
		valorBrutoParcela = valorBrutoParcela.round(2,0);
		var ajuste = valorBruto.minus(valorBrutoParcela.times(numeroParcelas));
		var valorBrutoParcela1 = Big(valorBrutoParcela.plus(ajuste));
		var valorLiquidoParcela = calcularValorLiquidoParcela(valorBrutoParcela1, tipoCartao, numeroParcelas);
		valores.push(valorLiquidoParcela1);
		var valorLiquidoParcels = calcularValorLiquidoParcela(valorBrutoParcela, tipoCartao, numeroParcelas);
		for(i=2;i<=numeroParcelas;i++){
			valores.push(valorLiquidoParcela);
		}
	} else {
		
	}
	return valores;	
}

function calcularValorLiquidoParcela(valorBrutoParcela, tipoCartao, numeroParcelas){
	var fator = Big(new Big(1).minus(obterPercentualDesconto(tipoCartao, bandeiraCartao, numeroParcelas)));
	var valorLiquidoParcela = valorBrutoParcela.times(fator);
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
function calcularValorParcela(valorVenda, numeroParcelas, tipoCartao){
	var valor = Big(valorVenda);
	if(valor.mod(numeroParcelas) != 0){
		var valorParcela = valor.div(numeroParcelas);
		if(ehDizimaPeriodica(valorParcela.toString())){
			
		}
	}
}

function ehDizimaPeriodica(numerador, denominador){
	var strValor = new Fraction(numerador, denominador).toString();
	if(strValor.indexOf("(") != -1 && strValor.indexOf(")") != -1){
		return true;
	} else return false;	
}
