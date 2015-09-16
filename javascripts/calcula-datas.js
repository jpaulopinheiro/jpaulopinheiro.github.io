$(function() {
	moment.locale('pt-BR');
	//setar data atual em $("#data-venda")
    $("#botao-calcular").click(calcularDatas);
    $("#botao-limpar").click(limpar);
    $("#botao-limpar").prop( "disabled", true );
    $("#tabela-resultados").hide();
});
 
function obterDataAtual() {
	return moment().toDate();
}

function calcularDatas() {
	var m = moment($("#data-venda").val());
	var numParcelas = $("#num-parcelas").val();

	for(parcela=1;parcela<=numParcelas;parcela++){
		var dataParcela = m.add(30, 'days');
		var diaDaSemana = dataParcela.day();
		while(!ehDiaUtil(diaDaSemana)){
			dataParcela = m.add(1, 'days');
			diaDaSemana = dataParcela.day();
		}
		adicionarLinha(parcela, dataParcela.format('L'));
		m = moment(dataParcela);
	}
	$("#data-venda").prop( "disabled", true );
	$("#parcelas").prop( "disabled", true );
	$("#botao-calcular").prop( "disabled", true );
	$("#botao-limpar").prop( "disabled", false );
	$("#botao-limpar").focus();
	$("#tabela-resultados").show();
}

function limpar() {
	$("#data-venda").prop( "disabled", false );
	$("#data-venda").focus();
	$("#parcelas").prop( "disabled", false );
	$("#botao-calcular").prop( "disabled", false );
	$("#botao-limpar").prop( "disabled", true );
	removerTodasLinhas();
	$("#tabela-resultados").hide();
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