<?php
	if(isset($_POST['submit']))
	{
		#code..
	}
?>
<html>
	<head>
		<script src="https://code.jquery.com/jquery-3.1.0.min.js"   integrity="sha256-cCueBR6CsyA4/9szpPfrX3s49M9vUU5BgtiJj06wt/s="   crossorigin="anonymous"></script>
		<script src="js/ministeckBlock.js"></script>
		<script src="js/ministeckPiece.js"></script>
		<script src="js/ministeckColor.js"></script>
		<script src="js/ministeckSymColorPair.js"></script>
		<script src="js/ministeckGenerator.js"></script>
		<title>Ministeck Online</title>
		<link href="css/style.css" rel="stylesheet" type="text/css">
	</head>
	<body>
	<?php
		$content = file_get_contents($_SERVER['DOCUMENT_ROOT']."/apps/Ministeck-Online/Afbeelding - 2.txt");
		echo '<input type="hidden" id="inputDoc" value='.json_encode(str_replace("\r\n", ",", $content)).'>';
	?>
		<script>
		//initialize
		
		</script>
		<form id="input" action="" method="POST">
			<input type="file" name="upload" id="input">
			<button type="submit" value="Hello world...!!!" name="submit" id="submit">Upload</button>
			<div id="load">
				<img src="load.gif">
				<br>
				<span id="process">0%</span>
			</div>
		</form>
	</body>
</html>