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
	checkSymbols: function(data)
	{
		// check symbols in input document (using this.inputDoc)
	},
	placeBlocks: function(height,length,amountHor,amountVer)
	{
		// create block array (using this.blocks and this.inputDoc)
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
	},
	getBlock: function(x,y)
	{
		// returns an ministeckBlock object for the specified coordinates
	},
	getRandomPiece: function()
	{
		// returns a random ministeckPiece object
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
	}
}