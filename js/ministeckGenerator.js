var ministeckGenerator = 
{
	pieces:[],
	symbols:[],
	blocks:[[]],
	inputDoc: [],
	canvas: undefined,
	amountx: 0,
	amounty: 0,
	maxTries: 0,
	currentTries: 0,
	useColorMapping: false,
	oldPieces: [],
	errorBlock: new ministeckBlock(0,0,14,false,false,false,false,new ministeckColor(0,0,0),new ministeckColor(0,0,0),this.canvas),
	loadFile: function()
	{
		var test = $("#inputDoc");
		if($("#inputDoc").val() != undefined)
		{
			this.inputDoc = $("#inputDoc").val().split(",");
			ministeckGenerator.placeBlocks();
		}
	},
	placeBlocks: function()
	{
		// create block array (using this.blocks and this.inputDoc)
		// TODO: set canvas height and width
		this.blocks = [];
		var amountVer = this.inputDoc.length;
		var amountHor = this.inputDoc[0].length;

		$("canvas").attr("width",(amountHor * 14).toString());
		$("canvas").attr("height",(amountVer * 14).toString());

		for(i = 0; i < amountVer; i++)
		{
			this.blocks.push([]);
			for(i2 = 0; i2 < amountHor; i2++)
			{
				var colors = this.charToColor(this.inputDoc[i].substr(i2,1));
				this.blocks[i].push(new ministeckBlock(i2,i,14,false,false,false,false,colors[0],colors[1],this.canvas));
			}
		}
	},
	charToColor: function(c)
	{
		// helper function for placeBlocks(), translates a character to an ministeckColor object array
		var result = [];
		for(var i = 0; i < this.symbols.length; i++)
		{
			if(this.symbols[i].symbol == c)
			{
				 result.push(this.symbols[i].color,this.symbols[i].outer);
				 break;
			}
		}
		return result;
	},
	generate: function()
	{
		// contains main generation loop
		var amountVer = this.inputDoc.length;
		var amountHor = this.inputDoc[0].length;
		var count = 0;
		for(i = 0; i < amountVer; i++)
		{
			for(i2 = 0; i2 < amountHor; i2++)
			{
				count++;
				this.oldPieces = [];
				var currentBlock = this.getBlock(i2,i);
				if(currentBlock.hasPiece == false)
				{
					
					this.generatePiece(i2,i);
				}
			}
		}

		$("form").fadeToggle();
		$("body").css("height","auto");
		this.paintBlocks();
		$("#download").fadeToggle();
	},
	paintBlocks: function()
	{
		// calls render functions for each block (using this.blocks[x].paint() and this.blocks[x].paintBorders())
		var amountVer = this.inputDoc.length;
		var amountHor = this.inputDoc[0].length;
		var count = 0;
		for(i = 0; i < amountVer; i++)
		{
			for(i2 = 0; i2 < amountHor; i2++)
			{
				this.blocks[i][i2].paint();
				this.blocks[i][i2].paintBorders();
			}
		}
	},
	generatePiece: function(x,y)
	{
		// recursive function for placing a piece on the board
		var success = this.checkPieceAndPlace(this.getRandomPiece(),x,y);
		if(!success)
		{
			this.generatePiece(x,y);
		}
	},
	checkPieceAndPlace: function(piece,x,y)
	{
		// main checking function, contains the MiniGen algorithm
		if(!this.checkOldPieces(piece))
		{
			if(piece.type == ministeckPieceTypes.block)
			{
				var bl = this.getBlock(x,y);
				if(bl.hasPiece)
				{
					this.oldPieces.push(piece);
					return false;
				}
				else
				{
					bl.leftb = true;
					bl.topb = true;
					bl.bottomb = true;
					bl.rightb = true;
					bl.hasPiece = true;
					return true;
				}
			}
			if(piece.type == ministeckPieceTypes.straight2)
			{
				var xs = [x,x + 1];
				var ys = [y,y];
				var ajacentBlocks = this.getBlockArray(xs,ys);
				if(this.checkBlockArray(ajacentBlocks,ajacentBlocks[0].fillColor))
				{
					this.oldPieces.push(piece);
					return false;
				}
				else
				{
					ajacentBlocks[0].leftb = true;
					ajacentBlocks[0].topb = true;
					ajacentBlocks[0].bottomb = true;
					ajacentBlocks[1].rightb = true;
					ajacentBlocks[1].topb = true;
					ajacentBlocks[1].bottomb = true;
					ajacentBlocks[0].hasPiece = true;
					ajacentBlocks[1].hasPiece = true;
					return true;
				}
			}
			if(piece.type == ministeckPieceTypes.straight2down)
			{
				var xs = [x,x];
				var ys = [y,y +1];
				var ajacentBlocks = this.getBlockArray(xs,ys);
				if(this.checkBlockArray(ajacentBlocks,ajacentBlocks[0].fillColor))
				{
					this.oldPieces.push(piece);
					return false;
				}
				else
				{
					ajacentBlocks[0].leftb = true;
					ajacentBlocks[0].rightb = true;
					ajacentBlocks[0].topb = true;
					ajacentBlocks[1].leftb = true;
					ajacentBlocks[1].bottomb = true;
					ajacentBlocks[1].rightb = true;
					ajacentBlocks[0].hasPiece = true;
					ajacentBlocks[1].hasPiece = true;
					return true;
				}
			}
			if(piece.type == ministeckPieceTypes.straight3)
			{
				var xs = [x,x + 1, x + 2];
				var ys = [y,y,y];
				var ajacentBlocks = this.getBlockArray(xs,ys);
				if(this.checkBlockArray(ajacentBlocks,ajacentBlocks[0].fillColor))
				{
					this.oldPieces.push(piece);
					return false;
				}
				else
				{
					ajacentBlocks[0].leftb = true;
					ajacentBlocks[0].topb = true;
					ajacentBlocks[0].bottomb = true;
					ajacentBlocks[1].bottomb = true;
					ajacentBlocks[1].topb = true;
					ajacentBlocks[2].rightb = true;
					ajacentBlocks[2].topb = true;
					ajacentBlocks[2].bottomb = true;
					ajacentBlocks[0].hasPiece = true;
					ajacentBlocks[1].hasPiece = true;
					ajacentBlocks[2].hasPiece = true;
					return true;
				}
			}
			if(piece.type == ministeckPieceTypes.straight3down)
			{
				var xs = [x,x,x];
				var ys = [y,y + 1,y + 2];
				var ajacentBlocks = this.getBlockArray(xs,ys);
				if(this.checkBlockArray(ajacentBlocks,ajacentBlocks[0].fillColor))
				{
					this.oldPieces.push(piece);
					return false;
				}
				else
				{
					ajacentBlocks[0].leftb = true;
					ajacentBlocks[0].topb = true;
					ajacentBlocks[0].rightb = true;
					ajacentBlocks[1].leftb = true;
					ajacentBlocks[1].rightb = true;
					ajacentBlocks[2].leftb = true;
					ajacentBlocks[2].bottomb = true;
					ajacentBlocks[2].rightb = true;
					ajacentBlocks[0].hasPiece = true;
					ajacentBlocks[1].hasPiece = true;
					ajacentBlocks[2].hasPiece = true;
					return true;
				}
			}
			if(piece.type == ministeckPieceTypes.fullblock)
			{
				var xs = [x,x + 1,x,x + 1];
				var ys = [y,y,y + 1,y + 1];
				var ajacentBlocks = this.getBlockArray(xs,ys);
				if(this.checkBlockArray(ajacentBlocks,ajacentBlocks[0].fillColor))
				{
					this.oldPieces.push(piece);
					return false;
				}
				else
				{
					ajacentBlocks[0].leftb = true;
					ajacentBlocks[0].topb = true;
					ajacentBlocks[1].rightb = true;
					ajacentBlocks[1].topb = true;
					ajacentBlocks[2].leftb = true;
					ajacentBlocks[2].bottomb = true;
					ajacentBlocks[3].rightb = true;
					ajacentBlocks[3].bottomb = true;
					ajacentBlocks[0].hasPiece = true;
					ajacentBlocks[1].hasPiece = true;
					ajacentBlocks[2].hasPiece = true;
					ajacentBlocks[3].hasPiece = true;
					return true;
				}
			}
			if(piece.type == ministeckPieceTypes.L)
			{
				var xs = [x,x,x + 1];
				var ys = [y,y + 1,y + 1];
				var ajacentBlocks = this.getBlockArray(xs,ys);
				if(this.checkBlockArray(ajacentBlocks,ajacentBlocks[0].fillColor))
				{
					this.oldPieces.push(piece);
					return false;
				}
				else
				{
					ajacentBlocks[0].leftb = true;
					ajacentBlocks[0].rightb = true;
					ajacentBlocks[0].topb = true;
					ajacentBlocks[1].leftb = true;
					ajacentBlocks[1].bottomb = true;
					ajacentBlocks[2].rightb = true;
					ajacentBlocks[2].topb = true;
					ajacentBlocks[2].bottomb = true;
					ajacentBlocks[0].hasPiece = true;
					ajacentBlocks[1].hasPiece = true;
					ajacentBlocks[2].hasPiece = true;
					ajacentBlocks[1].needPixelL = true;
					return true;
				}
			}
			if(piece.type == ministeckPieceTypes.L2)
			{
				var xs = [x,x,x + 1];
				var ys = [y,y + 1,y];
				var ajacentBlocks = this.getBlockArray(xs,ys);
				if(this.checkBlockArray(ajacentBlocks,ajacentBlocks[0].fillColor))
				{
					this.oldPieces.push(piece);
					return false;
				}
				else
				{
					ajacentBlocks[0].leftb = true;
					ajacentBlocks[0].topb = true;
					ajacentBlocks[1].leftb = true;
					ajacentBlocks[1].bottomb = true;
					ajacentBlocks[1].rightb = true;
					ajacentBlocks[2].rightb = true;
					ajacentBlocks[2].topb = true;
					ajacentBlocks[2].bottomb = true;
					ajacentBlocks[0].hasPiece = true;
					ajacentBlocks[1].hasPiece = true;
					ajacentBlocks[2].hasPiece = true;
					ajacentBlocks[0].needPixelL = true;
					return true;
				}
			}
			if(piece.type == ministeckPieceTypes.L3)
			{
				var xs = [x,x + 1,x + 1];
				var ys = [y,y,y + 1];
				var ajacentBlocks = this.getBlockArray(xs,ys);
				if(this.checkBlockArray(ajacentBlocks,ajacentBlocks[0].fillColor))
				{
					this.oldPieces.push(piece);
					return false;
				}
				else
				{
					ajacentBlocks[0].leftb = true;
					ajacentBlocks[0].topb = true;
					ajacentBlocks[0].bottomb = true;
					ajacentBlocks[1].topb = true;
					ajacentBlocks[1].rightb = true;
					ajacentBlocks[2].rightb = true;
					ajacentBlocks[2].leftb = true;
					ajacentBlocks[2].bottomb = true;
					ajacentBlocks[0].hasPiece = true;
					ajacentBlocks[1].hasPiece = true;
					ajacentBlocks[2].hasPiece = true;
					ajacentBlocks[1].needPixelL = true;
					return true;
				}
			}
			if(piece.type == ministeckPieceTypes.L4)
			{
				var xs = [x,x,x - 1];
				var ys = [y,y + 1,y + 1];
				var ajacentBlocks = this.getBlockArray(xs,ys);
				if(this.checkBlockArray(ajacentBlocks,ajacentBlocks[0].fillColor))
				{
					this.oldPieces.push(piece);
					return false;
				}
				else
				{
					ajacentBlocks[0].leftb = true;
					ajacentBlocks[0].topb = true;
					ajacentBlocks[0].rightb = true;
					ajacentBlocks[1].bottomb = true;
					ajacentBlocks[1].rightb = true;
					ajacentBlocks[2].topb = true;
					ajacentBlocks[2].leftb = true;
					ajacentBlocks[2].bottomb = true;
					ajacentBlocks[0].hasPiece = true;
					ajacentBlocks[1].hasPiece = true;
					ajacentBlocks[2].hasPiece = true;
					ajacentBlocks[1].needPixelL = true;
					return true;
				}
			}
		}
	},
	checkBlockArray: function(inputBlocks,color)
	{
		var result = false;
		for(var i3 = 0; i3 < inputBlocks.length; i3++)
		{
			if(inputBlocks[i3].fillColor.getColorString() != color.getColorString() || inputBlocks[i3].hasPiece == true)
			{
				result = true;
			}
		}
		return result;
	},
	checkOldPieces: function(piece)
	{
		var result = false;
		for(var i4 = 0; i4 < this.oldPieces.length; i4++)
		{
			if(this.oldPieces[i4].type == piece.type)
			{
				result = true;
			}
		}
		return result;
	},
	getBlockArray: function(xs,ys)
	{
		//returns ministeckBlock objects for all coordinates in the input array
		var results = [];
		for(i5 = 0; i5 < xs.length; i5++)
		{
			results.push(this.getBlock(xs[i5],ys[i5]));
		}
		return results;
	},
	getBlock: function(x,y)
	{
		// returns an ministeckBlock object for the specified coordinates
		if(y > this.blocks.length -1)
		{
			return this.errorBlock;
		}
		var result = this.blocks[y][x];
		if(result == undefined)
		{
			return this.errorBlock;
		}
		return result;

		/*for(i6 = 0; i6 < this.blocks.length; i6++)
		{
			if(this.blocks[i6].x == x && this.blocks[i6].y == y)
			{
				return this.blocks[i6];
			}
		}
		return this.errorBlock;
		*/
	},
	getRandomPiece: function()
	{
		// returns a random ministeckPiece object
		var test = Math.floor((Math.random() * 10));
		//console.log(test)
		return this.pieces[test];
	},
	loadPieces: function()
	{
		// adds all ministeckPieceType's into the pieces array(this.Pieces)
		this.pieces.push(new ministeckPiece(ministeckPieceTypes.block ,new ministeckColor(0,0,0)));
		this.pieces.push(new ministeckPiece(ministeckPieceTypes.straight2,new ministeckColor(0,0,0)));
		this.pieces.push(new ministeckPiece(ministeckPieceTypes.straight3,new ministeckColor(0,0,0)));
		this.pieces.push(new ministeckPiece(ministeckPieceTypes.straight2down,new ministeckColor(0,0,0)));
		this.pieces.push(new ministeckPiece(ministeckPieceTypes.straight3down,new ministeckColor(0,0,0)));
		this.pieces.push(new ministeckPiece(ministeckPieceTypes.L,new ministeckColor(0,0,0)));
		this.pieces.push(new ministeckPiece(ministeckPieceTypes.L2,new ministeckColor(0,0,0)));
		this.pieces.push(new ministeckPiece(ministeckPieceTypes.L3,new ministeckColor(0,0,0)));
		this.pieces.push(new ministeckPiece(ministeckPieceTypes.L4,new ministeckColor(0,0,0)));
		this.pieces.push(new ministeckPiece(ministeckPieceTypes.fullblock,new ministeckColor(0,0,0)));
	},
	loadDefaultSymbols: function()
	{
		this.symbols.push(new ministeckSymColorPair("A",new ministeckColor(251,166,28),new ministeckColor(121,80,13)));
		this.symbols.push(new ministeckSymColorPair("B",new ministeckColor(41,92,170),new ministeckColor(19,44,82)));
		this.symbols.push(new ministeckSymColorPair("C",new ministeckColor(241,89,35),new ministeckColor(116,42,16)));
		this.symbols.push(new ministeckSymColorPair("D",new ministeckColor(124,62,32),new ministeckColor(59,29,15)));
		this.symbols.push(new ministeckSymColorPair("E",new ministeckColor(255,241,0),new ministeckColor(123,116,0)));
		this.symbols.push(new ministeckSymColorPair("F",new ministeckColor(247,151,121),new ministeckColor(119,72,58)));
		this.symbols.push(new ministeckSymColorPair("G",new ministeckColor(23,135,57),new ministeckColor(11,65,27)));
		this.symbols.push(new ministeckSymColorPair("H",new ministeckColor(229,168,47),new ministeckColor(110,81,22)));
		this.symbols.push(new ministeckSymColorPair("I",new ministeckColor(254,237,210),new ministeckColor(122,114,101)));
		this.symbols.push(new ministeckSymColorPair("J",new ministeckColor(237,184,201),new ministeckColor(207,154,171)));
		this.symbols.push(new ministeckSymColorPair("K",new ministeckColor(129,130,132),new ministeckColor(62,62,63)));
		this.symbols.push(new ministeckSymColorPair("L",new ministeckColor(200,201,203),new ministeckColor(96,96,97)));
		this.symbols.push(new ministeckSymColorPair("M",new ministeckColor(182,97,35),new ministeckColor(87,46,16)));
		this.symbols.push(new ministeckSymColorPair("N",new ministeckColor(76,184,71),new ministeckColor(36,88,34)));
		this.symbols.push(new ministeckSymColorPair("O",new ministeckColor(86,98,61),new ministeckColor(41,47,29)));
		this.symbols.push(new ministeckSymColorPair("P",new ministeckColor(247,172,188),new ministeckColor(119,82,90)));
		this.symbols.push(new ministeckSymColorPair("Q",new ministeckColor(188,100,244),new ministeckColor(158,70,214)));
		this.symbols.push(new ministeckSymColorPair("R",new ministeckColor(218,33,41),new ministeckColor(105,15,19)));
		this.symbols.push(new ministeckSymColorPair("S",new ministeckColor(0,0,0),new ministeckColor(62,62,63)));
		this.symbols.push(new ministeckSymColorPair("T",new ministeckColor(174,144,51),new ministeckColor(83,69,24)));
		this.symbols.push(new ministeckSymColorPair("U",new ministeckColor(0,137,208),new ministeckColor(0,66,100)));
		this.symbols.push(new ministeckSymColorPair("V",new ministeckColor(129,42,145),new ministeckColor(121,80,13)));
		this.symbols.push(new ministeckSymColorPair("W",new ministeckColor(255,255,255),new ministeckColor(123,123,123)));
		this.symbols.push(new ministeckSymColorPair("X",new ministeckColor(140,198,63),new ministeckColor(67,95,30)));
		this.symbols.push(new ministeckSymColorPair("Y",new ministeckColor(236,0,141),new ministeckColor(113,0,68)));
		this.symbols.push(new ministeckSymColorPair("Z",new ministeckColor(116,157,210),new ministeckColor(55,75,101)));
		this.symsToSelect();
		
	},
	symsToSelect: function()
	{
		$("#symbol-selector").empty();
		$("#symbol-selector").append('<option value="EMPTY"></option>');
		for(var i = 0; i < this.symbols.length; i++)
		{
			$("#symbol-selector").append('<option style="color: rgb('+this.symbols[i].color.r+','+this.symbols[i].color.g+','+this.symbols[i].color.b+')" value="'+this.symbols[i].color.r+','+this.symbols[i].color.g+','+this.symbols[i].color.b+'|'+this.symbols[i].outer.r+','+this.symbols[i].outer.g+','+this.symbols[i].outer.b+'">&#9608;&#9608;&#9608; --> '+this.symbols[i].symbol+'</option>');
		}
	},
	remapSymbol: function(sym,col)
	{
		if(this.isLetter(sym) && sym.length == 1)
		{
			for(var i = 0; i < this.symbols.length; i++)
			{
				if(this.symbols[i].symbol == sym)
				{
					var colStrings = col.split("|");
					var fillColString = colStrings[0];
					var outerColString = colStrings[1];
					var fillColors = fillColString.split(",");
					var outerColors = outerColString.split(",");
					this.symbols[i].color.r = parseInt(fillColors[0]);
					this.symbols[i].color.g = parseInt(fillColors[1]);
					this.symbols[i].color.b = parseInt(fillColors[2]);
					this.symbols[i].outer.r = parseInt(outerColors[0]);
					this.symbols[i].outer.g = parseInt(outerColors[1]);
					this.symbols[i].outer.b = parseInt(outerColors[2]);
					this.symsToSelect();
					return;
				}
			}
		}
		else
		{
			alert("That character is not a letter!");
		}
	},
	isLetter: function(str)
	{
  		return str.length === 1 && str.match(/[a-z]/i);
	}
}