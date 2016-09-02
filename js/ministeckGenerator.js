var ministeckGenerator = 
{
	pieces:[],
	symbols:[],
	blocks:[],
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
		this.inputDoc = $("#inputDoc").val().split(",");
	},
	checkSymbols: function(data)
	{
		// check symbols in input document (using this.inputDoc)
	},
	placeBlocks: function(height,length,amountHor,amountVer)
	{
		// create block array (using this.blocks and this.inputDoc)
		// TODO: set canvas height and width
		for(i = 0; i < amountVer; i++)
		{
			for(i2 = 0; i2 < amountHor; i2++)
			{
				var colors = this.charToColor(this.inputDoc[i][i2]);
				this.blocks.push(new ministeckBlock(i2,i,14,false,false,false,false,colors[0],colors[1],this.canvas));
			}
		}
	},
	charToColor: function(c)
	{
		// helper function for placeBlocks(), translates a char to an ministeckColor object
	},
	generate: function()
	{
		// contains main generation loop
	},
	paintBlocks: function()
	{
		// calls render function for each block (using this.blocks[x].paint() and this.blocks[x].paintBorders())
	},
	generatePiece: function(x,y)
	{
		// recursive function for placing a piece on the board
	},
	checkPieceAndPlace: function(piece,x,y)
	{
		// main checking function, contains the MiniGen algorithm
	},
	getBlockArray: function(xs,ys)
	{
		//returns ministeckBlock objects for all coordinates in the input array
		var results = [];
		for(i = 0; i < xs.length; i++)
		{
			results.push(this.getBlock(xs[i],ys[i]));
		}
		return results;
	},
	getBlock: function(x,y)
	{
		// returns an ministeckBlock object for the specified coordinates
		for(i = 0; i < this.blocks.length; i++)
		{
			if(this.blocks[i].x == x && this.blocks[i].y == y)
			{
				return this.blocks[i];
			}
		}
		return this.errorBlock;
	},
	getRandomPiece: function()
	{
		// returns a random ministeckPiece object
		return this.pieces[Math.floor((Math.random() * 10))];
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
		this.symbols.push(new ministeckSymColorPair("K",new ministeckColor(129,130,132),new ministeckColor(62,62,63)));
		this.symbols.push(new ministeckSymColorPair("A",new ministeckColor(251,166,28),new ministeckColor(121,80,13)));
		this.symbols.push(new ministeckSymColorPair("A",new ministeckColor(251,166,28),new ministeckColor(121,80,13)));
		this.symbols.push(new ministeckSymColorPair("A",new ministeckColor(251,166,28),new ministeckColor(121,80,13)));
		this.symbols.push(new ministeckSymColorPair("A",new ministeckColor(251,166,28),new ministeckColor(121,80,13)));
		this.symbols.push(new ministeckSymColorPair("A",new ministeckColor(251,166,28),new ministeckColor(121,80,13)));
		this.symbols.push(new ministeckSymColorPair("A",new ministeckColor(251,166,28),new ministeckColor(121,80,13)));
		this.symbols.push(new ministeckSymColorPair("A",new ministeckColor(251,166,28),new ministeckColor(121,80,13)));
		this.symbols.push(new ministeckSymColorPair("A",new ministeckColor(251,166,28),new ministeckColor(121,80,13)));
		this.symbols.push(new ministeckSymColorPair("A",new ministeckColor(251,166,28),new ministeckColor(121,80,13)));
		this.symbols.push(new ministeckSymColorPair("A",new ministeckColor(251,166,28),new ministeckColor(121,80,13)));
		this.symbols.push(new ministeckSymColorPair("A",new ministeckColor(251,166,28),new ministeckColor(121,80,13)));
		this.symbols.push(new ministeckSymColorPair("A",new ministeckColor(251,166,28),new ministeckColor(121,80,13)));
		this.symbols.push(new ministeckSymColorPair("A",new ministeckColor(251,166,28),new ministeckColor(121,80,13)));
		this.symbols.push(new ministeckSymColorPair("A",new ministeckColor(251,166,28),new ministeckColor(121,80,13)));
	}
}
$(document).ready(function(){
	ministeckGenerator.loadPieces();
	ministeckGenerator.loadFile();
	ministeckGenerator.loadDefaultSymbols();
	});