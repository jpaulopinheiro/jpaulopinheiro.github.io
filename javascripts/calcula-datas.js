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
	var numParcelas = $("#parcelas").val();

	for(parcela=1;i<=numParcelas;parcela++){
		var dataParcela = m.add(30, 'days');
		//var p = "#p" + i;
		//$(p).html(dataParcela.format('L'));
		adicionarLinha(parcela, dataParcela)
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

function adicionarLinha(parcela, data){
    $("#tabela-resultados tbody").append(
    	"<tr>"+
        "<td>"+ parcela +"</td>"+
        "<td>"+ data +"</td>"+
        "</tr>");
};

Read more: http://www.linhadecodigo.com.br/artigo/3426/editando-e-removendo-linhas-em-uma-tabela-html-com-jquery.aspx#ixzz3luA45Fc5

