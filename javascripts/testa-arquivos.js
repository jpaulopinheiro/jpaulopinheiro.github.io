$(function() {

    //! moment.js locale configuration
    //! locale : brazilian portuguese (pt-br)
    //! author : Caio Ribeiro Pereira : https://github.com/caio-ribeiro-pereira

	moment.locale('pt-br', {
        months : 'Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro'.split('_'),
        monthsShort : 'Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez'.split('_'),
        weekdays : 'Domingo_Segunda-Feira_Terça-Feira_Quarta-Feira_Quinta-Feira_Sexta-Feira_Sábado'.split('_'),
        weekdaysShort : 'Dom_Seg_Ter_Qua_Qui_Sex_Sáb'.split('_'),
        weekdaysMin : 'Dom_2ª_3ª_4ª_5ª_6ª_Sáb'.split('_'),
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD/MM/YYYY',
            LL : 'D [de] MMMM [de] YYYY',
            LLL : 'D [de] MMMM [de] YYYY [às] HH:mm',
            LLLL : 'dddd, D [de] MMMM [de] YYYY [às] HH:mm'
        },
        calendar : {
            sameDay: '[Hoje às] LT',
            nextDay: '[Amanhã às] LT',
            nextWeek: 'dddd [às] LT',
            lastDay: '[Ontem às] LT',
            lastWeek: function () {
                return (this.day() === 0 || this.day() === 6) ?
                    '[Último] dddd [às] LT' : // Saturday + Sunday
                    '[Última] dddd [às] LT'; // Monday - Friday
            },
            sameElse: 'L'
        },
        relativeTime : {
            future : 'em %s',
            past : '%s atrás',
            s : 'poucos segundos',
            m : 'um minuto',
            mm : '%d minutos',
            h : 'uma hora',
            hh : '%d horas',
            d : 'um dia',
            dd : '%d dias',
            M : 'um mês',
            MM : '%d meses',
            y : 'um ano',
            yy : '%d anos'
        },
        ordinalParse: /\d{1,2}º/,
        ordinal : '%dº'
    });

	//setar data atual em $("#data-venda")
    //$("#botao-calcular").click(calcularDatas);
    $("#botao-testar").click(testar);
    $("#botao-limpar").click(limpar);
    //$("#tipo-cartao").change(habilitarParcelamento);
    $("#botao-limpar").prop( "disabled", true );
    $("#tabela-resultados").hide();
});

function testar(){

var arquivo = "server.js";
if(file_exists(arquivo)){
   //existe esse arquivo
   document.write("<h2>O arquivo " + arquivo + " existe no servidor</h2>");
   
   //vou ver quanto ocupa esse arquivo
   var tamanho = filesize(arquivo);
   document.write("<h2>O arquivo " + arquivo + " ocupa " + (tamanho/1024) + " Kb</h2>");
   
   //vou trazer seu conteúdo completo
   var texto_arquivo = file_get_contents(arquivo);
   document.write("<pre>" + texto_arquivo + "</pre>");
} else {
   document.write("O arquivo não existe.");
}
	
	//montarTabelaResultados(numeroParcelas, datas, valores);

	//desabilitarCamposAposCalculo();
	//$("#botao-limpar").focus();
	//$("#tabela-resultados").show();

}

function desabilitarCamposAposCalculo(){
	//$("#data-venda").prop( "disabled", true );
	//$("#valor-venda").prop( "disabled", true );
	//$("#tipo-cartao").prop( "disabled", true );
	//$("#bandeira-cartao").prop( "disabled", true );
	//$("#numero-parcelas").prop( "disabled", true );
	//$("#botao-calcular").prop( "disabled", true );
	//$("#botao-limpar").prop( "disabled", false );
}

function habilitarCamposParaCalculo(){
	//$("#data-venda").prop( "disabled", false );
	//$("#valor-venda").prop( "disabled", false );
	//$("#tipo-cartao").prop( "disabled", false );
	//$("#bandeira-cartao").prop( "disabled", false );
	//$("#numero-parcelas").prop( "disabled", false );
	//$("#botao-calcular").prop( "disabled", false );
	//$("#botao-limpar").prop( "disabled", true );
}



function montarTabelaResultados(numeroParcelas, datas, valores){
	for(i=1;i<=numeroParcelas;i++){
		addLinhaTabelaResultados(i, datas[i-1], parseFloat(valores[i-1].toString()));
	}
	var valorLiquidoTotal = Big(0);
	for(i=0;i<valores.length;i++){
		valorLiquidoTotal = valorLiquidoTotal.plus(valores[i]);
	}
	addRodapeTabelaResultados(parseFloat(valorLiquidoTotal.toString()));
}

function addLinhaTabelaResultados(parcela, data, valor){
    $("#tabela-resultados tbody").append(
    	"<tr>"+
	        "<td>"+ parcela +"</td>"+
	        "<td>"+ data.format('L') +"</td>"+
	        "<td>"+ accounting.formatMoney(valor, "R$", 2, ".", ",") +"</td>"+
        "</tr>");
}

function addRodapeTabelaResultados(valorLiquidoTotal){
    $("#tabela-resultados tfoot").append(
    	"<tr>"+
	        "<th colspan='2'>Total</th>"+
	        "<th>"+ accounting.formatMoney(valorLiquidoTotal, "R$", 2, ".", ",") +"</th>"+
        "</tr>");
}

function limparTabelaResultados() {
    $("#tabela-resultados tbody tr").remove();
    $("#tabela-resultados tfoot tr").remove();
}
