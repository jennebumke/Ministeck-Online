<?php

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
		<input type="hidden" name="inputDoc" value="">
		<script>
		//initialize
		
		</script>
		<form id="input" action="" method="POST">
			<input type="file" name="Upload" id="input">
			<div id="load">
				<img src="load.gif">
				<br>
				<span id="process">0%</span>
			</div>
		</form>
	</body>
</html>