$(function() {
	moment.locale('pt-BR');
    $("#data-venda").val(obterDataAtualFormatada());
    $("#botao-calcular").click(calcularDatas);
    $("#botao-limpar").click(limpar);
    $("#resultados").hide();
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
	$("#data-venda").prop( "disabled", true );
	$("#parcelas").prop( "disabled", true );
	$("#botao-calcular").prop( "disabled", true );
	$("#botao-limpar").prop( "disabled", false );
	$("#botao-limpar").focus();
	$("#resultados").show();
}

function limpar() {
	$("#data-venda").prop( "disabled", false );
	$("#data-venda").focus();
	$("#parcelas").prop( "disabled", false );
	$("#botao-calcular").prop( "disabled", false );
	$("#botao-limpar").prop( "disabled", true );
	$("#resultados").hide();
}
