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
		this.canvas.fillStyle = 'rgb('+ this.fillColor.r + ',' + this.fillColor.g + ',' + this.fillColor.b + ')';
		this.canvas.fillRect(this.x * 14, this.y * 14, 14 , 14);
	}
	this.paintBorders = function()
	{
		this.canvas.fillStyle = 'rgb('+ this.backColor.r + ',' + this.backColor.g + ',' + this.backColor.b + ')';

		// borders need to be painted (using this.canvas)
		if (this.rightb)
		{
			this.canvas.fillRect(this.x * 14 + 13, this.y * 14, 1 , 14);
		}

		if (this.leftb)
		{
			this.canvas.fillRect(this.x * 14, this.y * 14, 1 , 14);
		}

		if (this.topb)
		{
			this.canvas.fillRect(this.x * 14, this.y * 14, 14 , 1);
		}

		if (this.bottomb)
		{
			this.canvas.fillRect(this.x * 14, this.y * 14 + 13, 14 , 1);
		}
	}
}