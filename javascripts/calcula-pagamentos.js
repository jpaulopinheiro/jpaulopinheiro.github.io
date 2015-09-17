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
	var tipoCartao = $("#tipo-cartao").val();
	var bandeiraCartao = $("#bandeira-cartao").val();
	var numeroParcelas = obterNumeroParcelas(tipoCartao);
	
	var datas = calcularDatas(dataVenda, tipoCartao, bandeiraCartao, numeroParcelas);

	montarTabelaResultados(numeroParcelas, datas);	

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
	
	if(bandeiraCartao == "MC"){
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

function montarTabelaResultados(numeroParcelas, datas){
	for(i=1;i<=numeroParcelas;i++){
		addLinhaTabelaResultados(i, datas[i-1].format('L'));
	}	
}

function addLinhaTabelaResultados(parcela, data){
    $("#tabela-resultados tbody").append(
    	"<tr>"+
	        "<td>"+ parcela +"</td>"+
	        "<td>"+ data +"</td>"+
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

function calcularValorParcela(valorVenda, numeroParcelas, tipoCartao){
	var valor = Big(valorVenda);
	if(valor.mod(numeroParcelas) != 0){
		var valorParcela = valor.div(numeroParcelas);
		if(ehDizimaPeriodica(valorParcela.toString())){
			
		}
	}
}

function ehDizimaPeriodica(valor){
	var strValor = formatDecimal(valor);
	if(strValor.indexOf("(") != -1 && strValor.indexOf(")") != -1){
		return true;
	} else return false;	
}

// https://github.com/infusion/Fraction.js/tree/master
function formatDecimal(str) {
    var comma, pre, offset, pad, times, repeat;
    if (-1 === (comma = str.indexOf(".")))
        return str;
    pre = str.substr(0, comma + 1);
    str = str.substr(comma + 1);
    for (var i = 0; i < str.length; i++) {
        offset = str.substr(0, i);
        for (var j = 0; j < 5; j++) {
            pad = str.substr(i, j + 1);
            times = Math.ceil((str.length - offset.length) / pad.length);
            repeat = new Array(times + 1).join(pad); // Silly String.repeat hack
            if (0 === (offset + repeat).indexOf(str)) {
                return pre + offset + "(" + pad + ")";
            }
        }
    }
    return null;
}
