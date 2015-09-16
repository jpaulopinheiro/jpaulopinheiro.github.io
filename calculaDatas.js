$(function() {
	moment.locale('pt-BR');
    $("#data-venda").val(obterDataAtualFormatada());
    $("#botao-calcular").click(calcularDatas);
});
 
function obterDataAtualFormatada() {
	return moment().format('L');
}

function calcularDatas() {
	$("#resultados").hide();
}
