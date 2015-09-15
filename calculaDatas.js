$(function() {
	moment.locale('pt-BR');
    $("#data-venda").val(obterDataAtual());
});
 
function obterDataAtualFormatada() {
	return moment().format(L); 
};
