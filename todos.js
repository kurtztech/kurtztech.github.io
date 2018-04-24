/*Version 2.0*/

//get or create todos array
if (localStorage.getItem("todos") != null) {
	var todos = JSON.parse(localStorage.getItem("todos"));
} else {
	var todos = [];
}

//check off specific todos by clicking
$("ul").on("click", "li.canComplete", function(){
	$(this).toggleClass("completed");
});

//click on trash can to delete todo
$("ul").on("click", "span.spanDelete", function(event){
	$(this).parent().parent().fadeOut(function(){
		$(this).remove();
	});
	event.stopPropagation();
});

//click on arrows to add heaven and hell lines
$("ul").on("click", "span.spanExpand", function(event){
	$(this).children().toggleClass("fa-angle-double-down fa-angle-double-up");
	$(this).toggleClass("spanShow");
	$(this).parent().siblings().fadeToggle();
	event.stopPropagation();
});

//click plus/minus sign to toggle input box
$("#container").on("click", "#collapse", function(event){
	$(this).parent().siblings("input[type = 'text']").fadeToggle();
	$(this).toggleClass("fa-minus fa-plus");
	event.stopPropagation();
});

//on enter add text input as new todo
$("#inputTodo").keypress(function(event){
	if(event.which === 13) {
		//grabbing new todo text from input
		var todoText = escapeHtml($(this).val());
		$(this).val("");
		//create a new li and add to ul
		//very ugly but it works?
		$("#mainList").append("<ul><li class='canComplete'><span class='spanExpand'><i class='fa fa-angle-double-down'></i></span>" + todoText + "<span class='spanDelete'><i class='fas fa-trash'></i></span></li><li class='hidden'><i class='fas fa-times hellIcon'></i><input class='hellInput' type='text' placeholder='If you don&#39;t complete it...'></li><li class='hidden'><i class='fas fa-check heavenIcon'></i><input class='heavenInput' type='text' placeholder='If you do complete it...'></li></ul>");
	}
});

$(".fa-plus").on("click", function(){
	$("input[type = 'text']").fadeToggle();
});

$(document).ready(function() {
	for (var i = 0; i < todos.length; i++) {
		var todoText = escapeHtml(todos[i].todo);
		var hellText = escapeHtml(todos[i].hell);
		var heavenText = escapeHtml(todos[i].heaven);
		var compClass = (todos[i].completed) ? " completed" : "";
		console.log(compClass);
		console.log(todos[i].completed);
		$("#mainList").append("<ul><li class='canComplete" + compClass + "'><span class='spanExpand'><i class='fa fa-angle-double-down'></i></span>" + todoText + "<span class='spanDelete'><i class='fas fa-trash'></i></span></li><li class='hidden'><i class='fas fa-times hellIcon'></i><input class='hellInput' type='text' placeholder='If you don&#39;t complete it...' value='" + hellText + "'></li><li class='hidden'><i class='fas fa-check heavenIcon'></i><input class='heavenInput' type='text' placeholder='If you do complete it...' value='" + heavenText + "'></li></ul>");
		console.log("<ul><li class='canComplete" + compClass + "'><span class='spanExpand'><i class='fa fa-angle-double-down'></i></span>" + todoText + "<span class='spanDelete'><i class='fas fa-trash'></i></span></li><li class='hidden'><i class='fas fa-times hellIcon'></i><input class='hellInput' type='text' placeholder='If you don&#39;t complete it...' value='" + hellText + "'></li><li class='hidden'><i class='fas fa-check heavenIcon'></i><input class='heavenInput' type='text' placeholder='If you do complete it...' value='" + heavenText + "'></li></ul>");
	}
	setInterval(function(){
		if (localStorage.getItem("todos") || todos) {
			todos = [];
			$("#mainList > ul").each(function() {
				todos.push({
					todo : $(this).children("li:first").text(),
					hell : $(this).children().children("input:first").val(),
					heaven : $(this).children().children("input:last").val(),
					completed : $(this).children("li:first").hasClass("completed")
				});
				localStorage.setItem("todos", JSON.stringify(todos));
			});
		}
		if (todos.length === 0) {
			localStorage.clear();
		}
/*		console.log(todos[0].hell, todos[0].heaven, todos[0].todo);*/
	}, 500);
});

var entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;'
};

function escapeHtml (string) {
  return String(string).replace(/[&<>"'`=\/]/g, function (s) {
    return entityMap[s];
  });
}