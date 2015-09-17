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
	var valorParcela = valorBruto.div(numeroParcelas);

	if(ehDizimaPeriodica(valorParcela.toString())){
		valorParcela = valorParcela.round(2,0);
		var ajuste = valorBruto.minus(valorParcela.times(numeroParcelas));
		var valorParcela1 = Big(valorParcela.plus(ajuste));
		
		valores.push(valorParcela1);
		for(i=2;i<=numeroParcelas;i++){
			valores.push(valorParcela);
		}
	}
	return valores;	
}

function calcularValorParcela(valorVenda, numeroParcelas, tipoCartao){
	var valor = Big(valorVenda);
	if(valor.mod(numeroParcelas) != 0){
		var valorParcela = valor.div(numeroParcelas);
		if(ehDizimaPeriodica(valorParcela.toString())){
			
		}
	}
}

function ehDizimaPeriodica(valor){
	var strValor = new Fraction(valor).toString();
	if(strValor.indexOf("(") != -1 && strValor.indexOf(")") != -1){
		return true;
	} else return false;	
}
