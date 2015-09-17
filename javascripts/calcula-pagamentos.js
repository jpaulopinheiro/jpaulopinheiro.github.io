$(function() {
	moment.locale('pt-BR');
	//setar data atual em $("#data-venda")
    $("#botao-calcular").click(calcularDatas);
    $("#botao-limpar").click(limpar);
    $("#tipo-cartao").change(habilitarParcelamento);
    $("#botao-limpar").prop( "disabled", true );
    $("#tabela-resultados").hide();
    $("#parcelamento").hide();
});
 
function calcularDatas() {
	var dataVenda = moment($("#data-venda").val());
	var numParcelas = $("#num-parcelas").val();
	var prazo = 30;
	
	var tipoCartao = $("#tipo-cartao").val();
	var valorVenda = $("#valor-venda").val();
	calcularValorParcela(valorVenda,numParcelas,tipoCartao);
	

	for(parcela=1;parcela<=numParcelas;parcela++){
		var dataParcela = dataVenda.clone();
		dataParcela.add(prazo, 'days');
		var diaDaSemana = dataParcela.day();
		while(!ehDiaUtil(diaDaSemana)){
			dataParcela.add(1, 'days');
			diaDaSemana = dataParcela.day();
		}
		adicionarLinha(parcela, dataParcela.format('L'));
		prazo=prazo+30;
	}
	$("#data-venda").prop( "disabled", true );
	$("#num-parcelas").prop( "disabled", true );
	$("#botao-calcular").prop( "disabled", true );
	$("#botao-limpar").prop( "disabled", false );
	$("#botao-limpar").focus();
	$("#tabela-resultados").show();
}

function limpar() {
	$("#data-venda").prop( "disabled", false );
	$("#data-venda").focus();
	$("#num-parcelas").prop( "disabled", false );
	$("#botao-calcular").prop( "disabled", false );
	$("#botao-limpar").prop( "disabled", true );
	removerTodasLinhas();
	$("#tabela-resultados").hide();
}

function habilitarParcelamento(){
	var tipoCartao = $("#tipo-cartao").val();
	if(tipoCartao == 1){
		$("#parcelamento").show();
	} else $("#parcelamento").hide();
}

function adicionarLinha(parcela, data){
    $("#tabela-resultados tbody").append(
    	"<tr>"+
	        "<td>"+ parcela +"</td>"+
	        "<td>"+ data +"</td>"+
        "</tr>");
}

function removerTodasLinhas() {
    $("#tabela-resultados tbody tr").remove();
}

function ehDiaUtil(diaDaSemana){
	// dias nao úteis retornados pelo moment.js [0,6];
	var diasNaoUteis = [0,6];
	if($.inArray(diaDaSemana, diasNaoUteis) == -1){
		return true;
	} else return false;
}

function calcularValorParcela(valorVenda, numParcelas, tipoCartao){
	var valor = Big(valorVenda);
	if(valor.mod(numParcelas) != 0){
		var valorParcela = valor.div(numParcelas);
		alert(valorParcela);
	}
	alert("Usando fraction.js");
	var x = new Fraction(1/3);
	alert("1/3 = " + x);
	var y = new Fraction(4/13);
	alert("4/13 = " + y);
	var p = new Fraction([3].length, 6).toString();
	alert("p = " + p);
	
	
}