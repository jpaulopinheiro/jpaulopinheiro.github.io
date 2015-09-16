$(function() {
	moment.locale('pt-BR');
    $("#data-venda").val(obterDataAtualFormatada());
});
 
function obterDataAtualFormatada() {
	return moment().format('L');
}
