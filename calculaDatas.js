$(function() {
	moment.locale('pt-BR');
    $("#data-venda").val(obterDataAtualFormatada());
});
 
function obterDataAtualFormatada() {
	var dataAtualFormatada = moment().format(L);
	return dataAtualFormatada;
}
