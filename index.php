<?php
	$target_file = NULL;
	$error = NULL;
		// Check if image file is a actual image or fake image
	if(isset($_POST["submit"])) {
		$target_dir = "uploads/";
		$target_file = $target_dir . basename($_FILES["upload"]["name"]);
		$uploadOk = 1;
		$imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);

		if (file_exists($target_file)) {
			$error = "Sorry, file already exists.<br>";
			$uploadOk = 0;
		}

		if ($_FILES["upload"]["size"] > 100000000) {
			$error = "Sorry, your file is too large.<br>";
			$uploadOk = 0;
		}

		if($imageFileType != "txt") {
			$error = "Sorry, only TXT files are allowed.<br>";
			$uploadOk = 0;
		}

		if ($uploadOk == 1) {
			if (!move_uploaded_file($_FILES["upload"]["tmp_name"], $target_file)) {
				$error = "Sorry, there was an error uploading your file.";
			}
		}
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
		$content = file_get_contents("Afbeelding - 2.txt");
		echo '<input type="hidden" id="inputDoc" value='.json_encode(str_replace("\r\n", ",", $content)).'>';
		/*if(is_file($target_file))
		{
			$content = file_get_contents($target_file);
			echo '<input type="hidden" id="inputDoc" value='.json_encode(str_replace("\r\n", ",", $content)).'>';	
		}*/
	?>
		<script>
		//initialize
		
		</script>
		<form id="input" action="" method="POST" enctype="multipart/form-data">
			<input type="file" name="upload" id="input">
			<button type="submit" value="Hello world...!!!" name="submit" id="submit">Upload</button>
			<div id="load">
				<img src="load.gif">
				<br>
				<span id="process"><?php if($error){ echo $error;}else { echo "0%";} ?></span>
			</div>
		</form>
	</body>
</html>