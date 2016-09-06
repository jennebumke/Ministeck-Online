<?php
	$target_file = NULL;
	$error = NULL;
	$uploadOk = 0;
		// Check if image file is a actual image or fake image
	if(isset($_FILES["upload"]["name"]) && !isset($_POST["reload"])) {
		$target_dir = "uploads/";		
		$uploadOk = 1;
		$target_file = $target_dir . basename($_FILES["upload"]["name"]);
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
			else {
				$error = "100%";
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
		<script src="js/ministeckGenerator.js?<?php echo rand(); ?>"></script>
		<title>Ministeck Online</title>
		<link href="css/style.css?<?php echo rand(); ?>" rel="stylesheet" type="text/css">
	</head>
	<body>
	<?php
		//$content = file_get_contents("Afbeelding - 2.txt");
		//echo '<input type="hidden" id="inputDoc" value='.json_encode(str_replace("\r\n", ",", $content)).'>';
		if(is_file($target_file))
		{
			$content = file_get_contents($target_file);
			echo '<input type="hidden" id="inputDoc" value='.json_encode(str_replace("\r\n", ",", $content)).'>';
			unlink($target_file);
		}
		elseif(isset($_POST["submit"]))
		{
			echo '<input type="hidden" id="inputDoc" value="">';
			$error = "We lost your file :-(";
		}
	?>
		<script>
		//initialize
		$(document).ready(function(){
			$("form").fadeToggle();
			ministeckGenerator.canvas = $("canvas")[0].getContext("2d");
			ministeckGenerator.loadPieces();
			ministeckGenerator.loadDefaultSymbols();
			ministeckGenerator.loadFile();
			$("#input").change(function() {
        		$("form").submit();
				$("#load").fadeToggle();
    		});

    		$("#button").click(function() {
    			$("#button").fadeToggle();
    			$("#load").fadeToggle();
    			setTimeout(function(){
    				ministeckGenerator.generate();
    			},500);
    		});

    		console.log($("#process").html());
			if($("#process").html() == "100%"){
				$("#load").css("display","block");
				$("#load").fadeToggle();
			}
		});
		</script>
		<div class="copy">&copy; Powered by MiniGen algorithm by Luc Sieben</div>
		<canvas>
			
		</canvas>
		<div id="download" style="display:none;">
			<p>
				Thank you for using Ministeck Online!<br>
				Click the link below to get your generated image.
			</p>
			<p>
				<a id="download-link" download>Your generated image! (With love)</a>
			</p>
		</div>
		<form action="" method="POST" enctype="multipart/form-data" style="display:none;" >
			<p id="subtitle">
				Online Ministeck generator
			</p>
			<?php if($uploadOk == 0): ?>
			<input type="file" name="upload" id="input">
			<?php else: ?>
			<input type="button" value="generate" name="generate" id="button">
			<?php endif; ?>
			<div id="load" style="display:none;">
				<img src="load.svg" width="30px">
				<br>
				<span id="process"><?php if($error){ echo $error;} else { echo "0%";} ?></span>
			</div>
			<div class="column">
				
			</div>
			<div class="column">
				
			</div>
		</form>
	</body>
</html>