//TASKs data array
	if(localStorage.getItem('todos')) {
		var ToDos = JSON.parse(localStorage.getItem('todos'));
	}else{
		var ToDos = [];
	}

//PROJECTs data array	
	if(localStorage.getItem('projects')) {
		var Projects = JSON.parse(localStorage.getItem('projects'));
	}else{
		var Projects = [];
	}

//TASKs render all function	
	var listAllTodos = function(projectId){
		ToDos.sort(function(a,b) { return a.taskpriority - b.taskpriority } ); 
		$('[data-project-id='+projectId+'] .todos').empty();
		for(task=0;task<ToDos.length;task++){
			if (projectId == ToDos[task].projectid){
				if (ToDos[task].checked == 1){
						var checked = 'checked';
					}else {
						var checked = '';
					}	
		   		$('[data-project-id='+projectId+'] .todos').prepend(
		   			"<tr data-task-id='" +task +"' data-task-priority='"+ToDos[task].taskpriority+"' class='"+checked+"'> \
			   			<td class='task_check_holder'><input class='check' name='check' "+checked+" type='checkbox'/></td> \
			   			<td class='task_td_lines'></td> \
			   			<td class='task_description'>" + ToDos[task].description + "</td> \
			   			<td class='task_controls'> \
			   				<a class='task_move_link' href=''><a/> \
			   				<a class='task_edit_link' href=''><a/> \
			   				<a class='task_delete_link' href=''><a/> \
			   			"+"</td> \
		   			</tr>"
		   		);
	   		}
	   	}
	};


//PROJECTs render all function	
	var listAllProjects = function(){
		$('.projects').empty();
		for(pr=0;pr<Projects.length;pr++){	
	   		$('.projects').append(
				"<div class='project' data-project-id='"+Projects[pr].projectid+"' data-project-position='"+pr+"'> \
					<div class='project_header'> \
						<h3>"+Projects[pr].name+"</h3> \
						<div class='project_controls'> \
							<a href='' class='project_edit'></a> \
							<a href='' class='project_delete'></a> \
						</div> \
					</div>  \
					<div class='project_todos_form''> \
					  <form action='#' method='POST'> \
					  	<input class='description' name='description' type='text' placeholder='Type here to add your task..'/> \
					  	<a id='add' class='add-btn' href=''>Add task</a> \
					  </form> \
					</div>  \
					<div class='todos-list'> \
						<table class='todos' cellpadding='0' cellspacing='0'> \
						</table> \
					</div> \
				</div>"
		   	);
		   	listAllTodos(Projects[pr].projectid);
	   	}
	   	return false;
	};
	listAllProjects();

//PROJECT create new function
	var addProject = function(){
		if (Projects.length == 0){
			var projectId = 0;
		}else{
			var projectId = Projects[Projects.length-1].projectid + 1;
		}
		var projectName = "New TODO-list";
		var project = {
			projectid: projectId,
	   		name: projectName
		}
		Projects[Projects.length] = project;
		localStorage.setItem("projects",JSON.stringify(Projects));		
	};

//TASKs sort
	$('.projects').on("mouseenter",'.task_move_link', function() {
			var SortableListWrapper = $(this).parents('tbody');

			//prevent from changing of task-list's height while dragging tasks
			var ListHeight = $(this).parents('table').height(); 
			$(this).parents('table').height(ListHeight);

		    $(SortableListWrapper).sortable({
		    	handle: ".task_move_link",
		    	update: function(event, ui) {
			        $('tr').each(function(i) { 		        	
			            $(this).data('task-priority', i + 1); // updates the data object
			            $(this).attr('data-task-priority', 0 - i ); // updates the attribute
			            var TaskPosition = $(this).attr('data-task-id');
			            ToDos[TaskPosition].taskpriority = 0 - i;
			        });
			        localStorage.setItem("todos",JSON.stringify(ToDos));
			    }
		    });
            //ToDos.sort(function(a,b) { return b.taskpriority - a.taskpriority } );
			
		    $(SortableListWrapper).disableSelection();
	});

	$('.projects').on("click",'.task_move_link', function() {
		return false;
	});

//TASK create new function
	var addTodo = function(projectId){
		ToDos.sort(function(a,b) { return b.taskpriority - a.taskpriority } ); 
		var Description = $('[data-project-id='+projectId+'] .description').val();
		var Checked = 0;
		if (ToDos.length == 0){
			var taskPriority = 0;
		}else{
			var taskPriority = ToDos[0].taskpriority + 1;
		}
		var Task = {
	   		description: Description,
	   		projectid: projectId,
	   		checked: Checked,
	   		taskpriority: taskPriority
		}
	   	if(Description == '') {
		    $('[data-project-id='+projectId+'] .description').attr("placeholder", "Type something.. Empty task can't be saved :)");
		    $('[data-project-id='+projectId+'] .description').focus();
		    return false;
		   }   
	   	ToDos[ToDos.length] = Task;
	   	listAllProjects();
	   	$('[data-project-id='+projectId+'] form')[0].reset();
	   	$('[data-project-id='+projectId+'] .description').focus();  	   	
	   	localStorage.setItem("todos",JSON.stringify(ToDos));
	   	return false
	};

//PROJECT add
	$('.add_todo_list_btn').click( function() {
		addProject();
		listAllProjects();
		return false;
	});	

//PROJECT edit name
	$('.projects').on("click",'.project_edit', function() {
		var ProjectPosition = $(this).parents('.project').attr('data-project-position');
		var Project = Projects[ProjectPosition];
		var newProjectName = prompt("Edit TODO-list's name:", Project.name);
		if (newProjectName) {
			Project.name = newProjectName;
			Projects[ProjectPosition] = Project;
			listAllProjects();
			localStorage.setItem("projects",JSON.stringify(Projects));	
			return false;
		}else{
			return false;
		}
	});


//PROJECT delete
	$('.projects').on("click",'.project_delete', function() {
		var ProjectId = $(this).parents('.project').attr('data-project-id');
		var ProjectPosition = $(this).parents('.project').attr('data-project-position');
		//delete all project's tasks
		for(task=ToDos.length-1;task>=0;task--){	
			if (ToDos[task].projectid==ProjectId){
				ToDos.splice(task, 1);
			}
	   	}
	   	//delete project
	   	Projects.splice(ProjectPosition, 1);
		listAllProjects();
		localStorage.setItem("projects",JSON.stringify(Projects));
		localStorage.setItem("todos",JSON.stringify(ToDos));
		return false;
	});	


//TASK edit name
	$('.projects').on("click",'.task_edit_link', function() {
		var TaskId = $(this).parents('tr').attr('data-task-id');
		var Task = ToDos[TaskId];
		var newTaskName = prompt("Edit this task description:", Task.description);
		if (newTaskName) {
			Task.description = newTaskName;
			ToDos[TaskId] = Task;
			listAllProjects();
			localStorage.setItem("todos",JSON.stringify(ToDos));	
			return false;
		}else{
			return false;
		}
	});

//TASK add by pressing enter key
	$('.projects').on('submit', 'form', function () {
        var input = $(this).find('input.description');
        if (input.length && input.val() != '') {
            var projectId = input.parents('.project').attr('data-project-id');
            addTodo(projectId);
        }
        return false;
	})

//TASK add by clicking on add-btn
	$('.projects').on("click",'.add-btn', function() {
		var projectId = $(this).parents('.project').attr('data-project-id');
		addTodo(projectId);
		return false;
	});	

//TASK delete
	$('.projects').on("click",'.task_delete_link', function() {
		var TaskId = $(this).parents('tr').attr('data-task-id');
		var ProjectId = $(this).parents('.project').attr('data-project-id');
		ToDos.splice(TaskId, 1);
		listAllProjects();
		localStorage.setItem("todos",JSON.stringify(ToDos));
		return false;
	});	

//TASK check
	$('.projects').on("click",'.check', function() {
		var TaskId = $(this).parents('tr').attr('data-task-id');
		var ProjectId = $(this).parents('.project').attr('data-project-id');
		if (ToDos[TaskId].checked == 1){
			ToDos[TaskId].checked = 0;
		}else{
			ToDos[TaskId].checked = 1;
		}
		localStorage.setItem("todos",JSON.stringify(ToDos));
		listAllTodos(ProjectId);	
		return false;
	});	

//TASK delete all 
	$('#clear_to_dos').click( function() {
		ToDos = [];  	
		listAllProjects();
		localStorage.setItem("todos",JSON.stringify(ToDos));
		return false;
	});

//PROJECT delete all
	$('#clear_projects').click( function() {
		Projects = [];  	
		listAllProjects();
		localStorage.setItem("projects",JSON.stringify(Projects));
		return false;
	});
		