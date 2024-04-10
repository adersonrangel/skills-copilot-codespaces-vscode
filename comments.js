//Create web server
var http = require('http');
var fs = require('fs');
var url = require('url');
var comments = [];

http.createServer(function(req,res){
	//Parse request
	var url_parts = url.parse(req.url,true);
	var path = url_parts.pathname;
	var query = url_parts.query;
	
	if(path == '/'){
		//Read comments.html
		fs.readFile('comments.html', function(err,data){
			res.writeHead(200,{'Content-Type':'text/html'});
			res.write(data);
			res.end();
		});
	}else if(path == '/comment'){
		//Save comment
		comments.push(query.comment);
		
		//Redirect to home
		res.writeHead(302,{'Location':'/'});
		res.end();
	}else if(path == '/get'){
		//Send comments
		res.writeHead(200,{'Content-Type':'text/plain'});
		res.write(JSON.stringify(comments));
		res.end();
	}
}).listen(8080);
console.log('Server running at http://localhost:8080/');

// Path: index.html
<!DOCTYPE html>
<html>
<head>
	<title>Comments</title>
	<script src="http://code.jquery.com/jquery-1.11.0.min.js"></script>
	<script>
		$(document).ready(function(){
			//Get comments
			$.get('/get',function(data){
				var comments = JSON.parse(data);
				for(var i in comments){
					$('#comments').append('<li>'+comments[i]+'</li>');
				}
			});
			
			//Submit comment
			$('#comment_form').submit(function(){
				$.get('/comment',$('#comment_form').serialize(),function(){
					location.reload();
				});
				return false;
			});
		});
	</script>
</head>
<body>
	<h1>Comments</h1>
	<ul id="comments"></ul>
	<form id="comment_form">
		<input type="text" name="comment" placeholder="Comment"/>
		<input type="submit" value="Submit"/>
	</form>
</body>
</html>

// Path: comments.html
<!DOCTYPE html>
<html>
<head>
	<title>Comments</title>
	<script src="http://code.jquery.com/jquery-1.11.0.min.js"></script>
	<script>
		$(document).ready(function(){
			//Get comments
			$.