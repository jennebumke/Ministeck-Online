function ministeckBlock(x,y,heightlength,leftb,rightb,topb,bottomb,fillColor,backColor,canvas)
{
	// base variables
	this.x = x;
	this.y = y;
	this.heightlength = heightlength;
	this.leftb = leftb;
	this.rightb = rightb;
	this.topb = topb;
	this.bottomb = bottomb;
	this.fillColor = fillColor;
	this.backColor = backColor;
	this.hasPiece = false;
	this.needPixelL = false;
	this.canvas = canvas;
	// for colormapping
	this.isInSquare = false;
	
	//functions
	this.paint = function()
	{
		// paint inner color (using this.canvas)
	}
	this.paintBorders = function()
	{
		// borders need to be painted (using this.canvas)
	}
}