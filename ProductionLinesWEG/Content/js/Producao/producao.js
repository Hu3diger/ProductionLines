var Xconectors = 10;

$(function () {
    setDropDragItens();
});

// para controlar a imagem dos conectores
var CellAfterDrop;

// adiciona as propriedades aos objetos (drag e drop)
function setDropDragItens() {

    $(".dragBase").draggable({ helper: 'clone' });

    $(".dragClone").draggable({
        revert: 'invalid',
        start: function (event, ui) {
            var gotItem = $(ui.helper);

            CellAfterDrop = gotItem.parent();

            var objImg = gotItem.children().get(0);

            // verifica se � do tipo imgem
            if ($(objImg).is("img")) {

                let str = $(objImg).attr("src");

                // o caminho da imagem sem o nome da imagem atual
                let str2 = str.substring(0, str.lastIndexOf("/cn") + 3);

                // apenas o numero da imagem
                var nameImg = str.substring(
                    str.lastIndexOf("/cn") + 3, // remover 'cn' do nome d imagem
                    str.lastIndexOf(".png")
                );

                // verifica se a imagem contem o nome correto e o X, caso tiver, remove
                for (var i = 1; i <= Xconectors; i++) {

                    if (nameImg == (i + "x")) {

                        nameImg = nameImg.substring(0, nameImg.lastIndexOf("x"));
                        break;

                    }
                }

                // adicion o novo nome ao caminho da imagem
                str2 += nameImg + ".png";

                // seta o caminho a imagem
                $(objImg).attr("src", str2);

            }
        },
        stop: function (ev, ui) {
            $(this).attr('style', 'position: relative;');
        }
    });

    $(".tCell").droppable({
        // aceita os objeto que contenham as seguintes classes
        accept: '.dragBase, .dragClone',
        drop: function (ev, ui) {
            var droppedItem = $(ui.draggable);

            // verifica se contem nada na celula ou a celular contem o mesmo item que foi dropado
            if ($(this).children().length == 0 || !droppedItem == $(this).children().get(0)) {

                if (droppedItem.hasClass("dragBase")) {
                    droppedItem = droppedItem.clone();
                    droppedItem.removeClass("dragBase").addClass("dragClone");
                }

                $(this).html(droppedItem);

                // reajusta a tabela
                reajustTable();

                setDropDragItens();
            }


            if (CellAfterDrop) {
                analyzeCell(CellAfterDrop);
            }

            analyzeCell(droppedItem.parent());
        }
    });

    $('.tTrash').droppable({
        drop: function (event, ui) {
            var droppedItem = $(ui.draggable);

            if (!droppedItem.hasClass("dragBase")) {
                // remove o item do "sistema"
                ui.draggable.remove();
            }

            reajustTable();

            if (CellAfterDrop) {
                analyzeCell(CellAfterDrop);
            }
        }
    });
}

// reajusta a tabela para que tenham uma linha e coluna a vazia no fim
function reajustTable($currentCell) {

    let tBody = $("#tdropesteiras tbody");

    let bottom = tBody.get(0).lastElementChild;

    // verifica se a ultima linha contem algo
    var controlBottom = reajustTableVerifyLine($(bottom));

    // verifica se a ultima coluna contem algo
    var controlRight = reajustTableVerifyColumn(tBody, $(bottom).children().length - 1);

    // se conter algo na ultima coluna, ele gera uma nova coluna para todas as linhas
    if (controlRight) {

        for (var i = 0; i < tBody.children().length; i++) {
            $('<td class="tCell">').appendTo(tBody.children()[i]);
        }
    } else {
        if ($(bottom).children().length > 1) {

            // verifica se contem algo na penultima linha para poder excluir a ultima
            if (!reajustTableVerifyColumn(tBody, $(bottom).children().length - 2)) {

                for (var i = 0; i < tBody.children().length; i++) {

                    var line = $(tBody.children().get(i));

                    $(line.children().get(line.children().length - 1)).remove();
                }

                reajustTable();
            }
        }
    }

    // se estiver na ultima linha, ele gera uma nova linha, sen�o 
    if (controlBottom) {

        let tr = $("<tr>").appendTo(tBody);

        for (var i = 0; i < $(bottom).children().length; i++) {
            $('<td class="tCell">').appendTo(tr);
        }
    } else {
        if (tBody.children().length > 1) {

            // verifica se contem algo na penultima linha para poder excluir a ultima
            if (!reajustTableVerifyLine($(tBody.children().get(tBody.children().length - 2)))) {
                $(tBody.get(0).lastElementChild).remove();
                reajustTable();
            }
        }
    }
}

// verifica se a linha inteira esta vazia
// false = vazia
function reajustTableVerifyLine(line) {
    for (var i = 0; i < line.children().length; i++) {

        // verifica se contem algo na celula
        if ($(line.children().get(i)).children().length != 0) {
            return true;
        }
    }

    return false;
}

// verifica se a coluna inteira esta vazia
// false = vazia
function reajustTableVerifyColumn(tBody, number) {

    for (var i = 0; i < tBody.children().length; i++) {

        var line = $(tBody.children().get(i));

        // verifica se contem algo na coluna especificada
        if ($(line.children().get(number)).children().length != 0) {
            return true;
        }
    }

    return false;
}

// verifica a celula na frente e traz para ver se nao a conector para editar por perto
function analyzeCell(cell, reControl) {


    // faz modifica��es (se necessario) na imagem do conector
    // analiza a celula atual
    function analyzeCurrentCell(target, nextCell, directionClass) {

        // pega a div da celula
        let obj = $(target).children().get(0);

        // pega a div da celula
        let nObj = $(nextCell).children().get(0);

        if ($(obj).hasClass(directionClass)) {

            // verifica se estra preenchida
            if (obj) {

                // pega o objeto dentro da div
                let objImg = $(obj).children().get(0);

                // verifica se � do tipo imgem
                if ($(objImg).is("img")) {

                    // caminho da imagem toda
                    let str = $(objImg).attr("src");

                    // o caminho da imagem sem o nome da imagem atual
                    let str2 = str.substring(0, str.lastIndexOf("/cn") + 3);

                    // apenas o numero da imagem
                    var nameImg = str.substring(
                        str.lastIndexOf("/cn") + 3, // remover 'cn' do nome d imagem
                        str.lastIndexOf(".png")
                    );

                    // vriavel pra o novo nome da imagem
                    var newName = nameImg;

                    // verifica se a proxima celula contem algo e se conter, verifica se � outro conector
                    if (nObj && $(nObj).hasClass("conectorP") && $(nObj).hasClass("recive" + directionClass)) {

                        // verifica se a imagem contem o nome correto e o X, caso nao tiver, adiciona
                        for (var i = 1; i <= Xconectors; i++) {

                            if (("" + i) == nameImg) {

                                newName = nameImg + "x";
                                break;

                            }
                        }

                    } else {

                        // verifica se a imagem contem o nome correto e o X, caso tiver, remove
                        for (var i = 1; i <= Xconectors; i++) {

                            if (nameImg == (i + "x")) {

                                newName = nameImg.substring(0, nameImg.lastIndexOf("x"));
                                break;

                            }
                        }

                    }

                    // adicion o novo nome ao caminho da imagem
                    str2 += newName + ".png";

                    // seta o caminho a imagem
                    $($(obj).children().get(0)).attr("src", str2);
                }
            }
        }
    }









    // varialvel para o objeto dentro da celula
    let obj = $(cell.children().get(0));

    var Tr = cell.parent();

    var tBody = Tr.parent();

    let indexTr = tBody.children().index(Tr);

    var indexCell = Tr.children().index(cell);



    // celulas ao redor da principal
    let antCell = $(Tr.children().get(indexCell - 1));

    let nextCell = $(Tr.children().get(indexCell + 1));

    let upCell = $($(tBody.children().get(indexTr - 1)).children().get(indexCell));

    let downCell = $($(tBody.children().get(indexTr + 1)).children().get(indexCell));


    cell.removeClass("red darken-1");

    if (obj.hasClass("Cfront")) {
        // faz modifica��es (se necessario) na imagem do conector
        analyzeCurrentCell(cell, nextCell, "Cfront");

        // variavel de controle da recursividade
        if (!reControl) {
            // faz o processo com a proxima celular sem "habilitar" novamente a recursividade
            analyzeCell(nextCell, true);
        }

    } else if (obj.hasClass("Cup")) {

        analyzeCurrentCell(cell, upCell, "Cup");

        if (!reControl) {
            analyzeCell(upCell, true);
        }

    } else if (obj.hasClass("Cdown")) {

        analyzeCurrentCell(cell, downCell, "Cdown");

        if (!reControl) {
            analyzeCell(downCell, true);
        }

    }

    // verifica se existe a celula e se � possivel fazer a recursividade
    if (antCell && !reControl) {
        // faz a recursividade para verificar a celula vizinha
        analyzeCell(antCell, true);
    }

    if (upCell && !reControl) {
        analyzeCell(upCell, true);
    }

    if (nextCell && !reControl) {
        analyzeCell(nextCell, true);
    }

    if (downCell && !reControl) {
        analyzeCell(downCell, true);
    }

    // verifica se a celula existe
    if (antCell) {
        // analiza a celula e altera a imagem se necessario
        analyzeCurrentCell(antCell, cell, "Cfront");
        // verfica se o objeto da celula atual e tambem se a celula vizinha � uma esteira e se ela esta "enviando" na sua dire��o
        if (obj.hasClass("reciveCfront") && !$(antCell.children().get(0)).hasClass("esteiraP") && !$(antCell.children().get(0)).hasClass("Cfront")) {
            // marca a celula para representar um Erro
            cell.addClass("red darken-1");
        }
    }

    if (upCell) {
        analyzeCurrentCell(upCell, cell, "Cdown");

        if (obj.hasClass("reciveCdown") && !$(upCell.children().get(0)).hasClass("Cdown") && !$(upCell.children().get(0)).hasClass("reciveCup")) {
            cell.addClass("red darken-1");
        }
    }

    if (downCell) {
        analyzeCurrentCell(downCell, cell, "Cup");

        if (obj.hasClass("reciveCup") && !$(downCell.children().get(0)).hasClass("Cup") && !$(downCell.children().get(0)).hasClass("reciveCdown")) {
            cell.addClass("red darken-1");
        }
    }


    if (nextCell) {

        // verifica para qual dire��o o objeto da celula atual aponta e se tem algum conector ou esteira
        if (obj.hasClass("Cfront") && !$(nextCell.children().get(0)).hasClass("esteiraP") && !$(nextCell.children().get(0)).hasClass("conectorP")) {
            // marca a celula para representar um Erro
            cell.addClass("red darken-1");
        } else if (obj.hasClass("Cup") && !$(upCell.children().get(0)).hasClass("esteiraP") && !$(upCell.children().get(0)).hasClass("conectorP")) {
            cell.addClass("red darken-1");
        } else if (obj.hasClass("Cdown") && !$(downCell.children().get(0)).hasClass("esteiraP") && !$(downCell.children().get(0)).hasClass("conectorP")) {
            cell.addClass("red darken-1");
        }
    }

    if (obj.hasClass("Cup") && obj.hasClass("Cdown") && !obj.hasClass("Cfront")) {

        var objImg = $(obj).children().get(0);

        // verifica se � do tipo imgem
        if ($(objImg).is("img")) {

            let str = $(objImg).attr("src");

            // o caminho da imagem sem o numero da imagem atual
            let str2 = str.substring(0, str.lastIndexOf("/cn") + 3);

            // variavel para o nome da imagem final
            var nameImg;

            // controle para saber quantos "receptores" existem para o objeto atual
            var c = 0;

            if ($(upCell.children().get(0)).hasClass("reciveCup")) {
                nameImg = "Down";
                c++;
            }

            if ($(downCell.children().get(0)).hasClass("reciveCdown")) {
                nameImg = "Up";
                c++;
            }

            if (c == 2) {
                nameImg = "9x";
            } else if (c == 0) {
                nameImg = "9";
            }


            // adicion o novo nome ao caminho da imagem
            str2 += nameImg + ".png";

            // seta o caminho a imagem
            $(objImg).attr("src", str2);
        }
    }
}