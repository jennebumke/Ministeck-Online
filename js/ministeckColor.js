function ministeckColor(r,g,b)
{	//function called to obtain color
	this.r = r;
	this.g = g;
	this.b = b;
	
	this.getColorString = function()
	{
		return "" + this.r.toString() + this.g.toString() + this.b.toString();
	}
}