$(function() {
    obterDataAtual();
});
 
function obterDataAtual() {
	var dataAtual = new Date();
    $("#data-venda").val(dataAtual);
};
