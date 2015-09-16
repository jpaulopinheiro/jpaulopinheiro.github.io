$(function() {
	//moment.locale('pt-BR');
    $("#data-venda").val(obterDataAtualFormatada());
    $("#botao-calcular").click(calcularDatas);
    $("#botao-limpar").click(limpar);
});
 
function obterDataAtualFormatada() {
	return moment().format('L');
}

function calcularDatas() {
	var m = moment($("#data-venda").val());
	var parcelas = $("#parcelas").val();
	for(i=1;i<=parcelas;i++){
		var dataParcela = m.add(30, 'days');
		var p = "#p" + i;
		$(p).html(dataParcela.format('L'));
		m = moment(dataParcela);
	}
}

function limpar() {
	$("#resultados").hide();
}
