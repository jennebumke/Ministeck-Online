using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Threading;
using System.Windows.Forms;
using System.IO;

namespace ministecktest
{
    public partial class Form1 : Form
    {
        ministeckGenerator gen;
        bool ready = false;
        string input = "";
        public Form1()
        {
            InitializeComponent();

        }

        private void Form1_Load(object sender, EventArgs e)
        {
            pMiniSteck.Height = this.Height - 41 - 20;
            pMiniSteck.Width = this.Width - 12 - 20;
            ofdInput.InitialDirectory = Environment.CurrentDirectory;
            this.DoubleBuffered = true;
            worker.WorkerReportsProgress = true;
            Console.SetOut(new ControlWriter(rtbText));
            cbMaxTrys.SelectedIndex = 9;
            worker.WorkerSupportsCancellation = true;
            Console.Write("Welcome to Ministeck Tools. Developed by Luc Sieben.\nUses MiniGen algorithm © 2016 - Luc Sieben.");
        }
        
        public string[] paddata(string[] data)
        {
            List<string> temp = new List<string>();
            int maxlenght = 1;
            foreach(string line in data)
            {
                if(line.Length > maxlenght)
                {
                    maxlenght = line.Length;
                }
                
            }
            foreach(string line in data)
            {
                temp.Add(line.PadLeft(maxlenght, ' '));
            }
            return temp.ToArray();
            
        }

        private void pMiniSteck_Paint(object sender, PaintEventArgs e)
        {
            if (ready == true)
            {
                Console.Write("painting blocks...");
                gen.paintblocks(e.Graphics);
                Bitmap bp = new Bitmap(pMiniSteck.Width, pMiniSteck.Height);
                pMiniSteck.DrawToBitmap(bp, pMiniSteck.DisplayRectangle);
                string name = Path.GetFileNameWithoutExtension(this.input);
                bp.Save(name + ".bmp");
                Console.Write("done");
                Console.Write("Saved to " + name + ".bmp");
                ready = false;
                btnGenerate.Enabled = true;
                btnLoad.Enabled = true;
                
            }

        }

        private void pMiniSteck_Scroll(object sender, ScrollEventArgs e)
        {
            
        }

        private void suspendToolStripMenuItem_Click(object sender, EventArgs e)
        {
            pMiniSteck.SuspendLayout();
        }

        private void unsuspendToolStripMenuItem_Click(object sender, EventArgs e)
        {
            pMiniSteck.ResumeLayout();
        }

        public void worker_DoWork(object sender, DoWorkEventArgs e)
        {
            ministeckGenerator generator = new ministeckGenerator(pMiniSteck,this,cbMaxTrys.SelectedIndex + 1,cbColorMapping.Checked,Convert.ToInt32(tbMaxSquareSize.Text));
            gen = generator;
            string[] lines = File.ReadAllLines(this.input);
            generator.checkSymbols(lines);
            generator.loadpieces();
            generator.placeblocks(14, 14, lines[0].Length, lines.Length, paddata(lines));
            generator.calculateColorMapping();
            Console.WriteLine("generating pieces...");
            //generator.test();
            generator.generate();
           
        }

        private void worker_ProgressChanged(object sender, ProgressChangedEventArgs e)
        {
            
        }

        private void worker_RunWorkerCompleted(object sender, RunWorkerCompletedEventArgs e)
        {
            lbPro.Visible = false;
            lbPro.Text = "Painting blocks...";
            ready = true;
            pMiniSteck.Invalidate();
            
            
            
        }

        private void btnLoad_Click(object sender, EventArgs e)
        {
            if(ofdInput.ShowDialog() == System.Windows.Forms.DialogResult.OK)
            {
                this.input = ofdInput.FileName;
                Console.Write("Loaded " + this.input);
            }
        }

        private void btnGenerate_Click(object sender, EventArgs e)
        {
            btnGenerate.Enabled = false;
            btnLoad.Enabled = false;
            worker.RunWorkerAsync("generate_pattern");
        }
        // TEST
        public class ControlWriter : TextWriter
        {
            private Control textbox;
            public ControlWriter(Control textbox)
            {
                this.textbox = textbox;
            }

            public override void Write(char value)
            {
                textbox.Text += value;
            }

            public override void Write(string value)
            {
                textbox.Text = "";
                textbox.Text += value;
            }

            public override Encoding Encoding
            {
                get { return Encoding.ASCII; }
            }
        }

        private void rtbText_TextChanged(object sender, EventArgs e)
        {
            rtbText.SelectionStart = rtbText.Text.Length;
            
            rtbText.ScrollToCaret();
        }

        private void btnAbort_Click(object sender, EventArgs e)
        {
            worker.CancelAsync();
            btnAbort.Enabled = false;
            btnAbort.Text = "Canceling...";
        }
    }
    public static class EnumUtil
    {
        public static IEnumerable<T> GetValues<T>()
        {
            return Enum.GetValues(typeof(T)).Cast<T>();
        }
    }
    public class ministeck_symbol_reader
    {
        public Bitmap image;
        public ministeck_symbol_reader(string path)
        {
            image = (Bitmap) Bitmap.FromFile(path);
        }
       
    }
    public class ministeck_piece
    {
        public type piece_type;
        public Color col;
        public ministeck_piece(type t,Color c)
        {
            piece_type = t;
            col = c;
        }
        public enum type
        {
            block, straight2, straight2down, straight3, straight3down, L, L2, L3, L4, fullblock
        }

    }
    public class ministeck_block
    {
        public static Random r = new Random();
        public int xpos;
        public int ypos;
        public int blockheight;
        public int blocklength;

        //borders
        public bool leftborder = false;
        public bool rightborder = false;
        public bool topborder = false;
        public bool bottomborder = false;

        //coloring
        public bool haspiece = false;
        public Color fillcolor = Color.Green;
        public Color bordercolor;
        public Graphics g;
        //pixel properties
        public bool needpixelL = false;
        //panel reference for painting
        public Panel refpanel;

        public bool isInSquare = false;
        public ministeck_block(int x, int y, int heightlength, bool leftb, bool rightb, bool topb, bool bottomb, Panel p,Color c, Color bc)
        {
            xpos = x;
            ypos = y;
            blockheight = heightlength;
            blocklength = heightlength;
            leftborder = leftb;
            rightborder = rightb;
            topborder = topb;
            bottomborder = bottomb;
            refpanel = p;
            fillcolor = c;
            g = refpanel.CreateGraphics();
            bordercolor = bc;
        }
        public void getBorderColor()
        {
            ColorConverter c = new ColorConverter();
            bordercolor = ControlPaint.Dark(bordercolor);
        }
        public void paint(Graphics g)
        {
            g.FillRectangle(new Pen(fillcolor).Brush, (xpos * 14), (ypos * 14), 14, 14);
        }

        public void paintBorders(Graphics g)
        {
            Brush b = new Pen(bordercolor).Brush;
            Brush bf = new Pen(fillcolor).Brush;
            if (leftborder == true)
            {

                g.FillRectangle(b, (xpos * 14), (ypos * 14), 1, 14);
            }
           
            if (rightborder == true)
            {
                
                int borderx = (xpos * 14) + 13;
                g.FillRectangle(b, borderx, (ypos * 14), 1, 14);
            }
           
            if (topborder == true)
            {

                g.FillRectangle(b, (xpos * 14), (ypos * 14), 14, 1);
            }
           
            if (bottomborder == true)
            {
                
                int bordery = (ypos * 14) + 13;
                g.FillRectangle(b, (xpos * 14), bordery, 14, 1);
            }

            // We need to paint an extra pixel for an L shaped piece.
            if(bottomborder == true && leftborder == true && rightborder == false && topborder == false && this.needpixelL == true)
            {
                // paint extra pixel
                g.FillRectangle(b, (xpos * 14) + 13, ypos * 14, 1, 1);
            }
            if (bottomborder == false && leftborder == false && rightborder == true && topborder == true && this.needpixelL == true)
            {
                // paint extra pixel
                g.FillRectangle(b, xpos * 14, (ypos * 14) + 13, 1, 1);
            }

            if (bottomborder == true && leftborder == false && rightborder == true && topborder == false && this.needpixelL == true)
            {
                // paint extra pixel
                g.FillRectangle(b, xpos * 14, ypos * 14, 1, 1);
            }
            if (bottomborder == false && leftborder == true && rightborder == false && topborder == true && this.needpixelL == true)
            {
                // paint extra pixel
                g.FillRectangle(b, (xpos * 14) + 13, (ypos * 14) + 13, 1, 1);
            }
        }
    }
    public class symColorPair
    {
        public char symbol;
        public Color color;
        public Color outer;
        public symColorPair(char sym, Color col, Color outercol)
        {
            this.symbol = sym;
            this.color = col;
            this.outer = outercol;
        }
    }
    public class ColorSquare
    {
        public int startX;
        public int startY;

        public int endX;
        public int endY;

        public Color fillColor;
        public ColorSquare(int startx, int starty, int endx,int endy,Color color)
        {
            this.endX = endx;
            this.endY = endy;
            this.fillColor = color;
            this.startX = startx;
            this.endX = endx;
        }
    }
    public class ministeckGenerator
    {
        List<ministeck_piece> pieces = new List<ministeck_piece>();
        public static Random r = new Random();
        public List<symColorPair> symbols = new List<symColorPair>();
        public Panel refpanel;
        public Form1 refform;
        List<ministeck_block> blocks = new List<ministeck_block>();
        public int amountx;
        public int amounty;
        public ToolStripProgressBar progress;
        public int maxTries;
        public int currentTries = 0;
        public bool useColorMapping;
        public int minSquareSize;
        public List<ColorSquare> ColorMap = new List<ColorSquare>();
        public List<ministeck_piece.type> oldPieces = new List<ministeck_piece.type>();
        public ministeck_block errorblock = new ministeck_block(2, 2, 2, true, true, false, false, new Panel(),Color.Black,Color.Black);
        public ministeckGenerator(Panel p, Form1 f,int maxTries,bool useColorMapping,int minSquareSize)
        {
            refpanel = p;
            refform = f;
            this.maxTries = maxTries;
            this.useColorMapping = useColorMapping;
            this.minSquareSize = minSquareSize;
            loadpieces();
            errorblock.haspiece = true;
        }

        public bool checkSymbols(string[] data)
        {
            List<char> syms = new List<char>();
            List<string> unknownsyms = new List<string>();
            foreach(string sym in data)
            {
                foreach(char c in sym)
                {
                    if (!syms.Contains(c))
                    {
                        if (File.Exists(c.ToString() + ".bmp"))
                        {
                            syms.Add(c);
                        }
                    }
                }
            }
            foreach(char c in syms)
            {
                Bitmap image = (Bitmap) Bitmap.FromFile(c.ToString() + ".bmp");
                Color inner = image.GetPixel(3, 3);
                Color outer = image.GetPixel(0,0);
                symColorPair s = new symColorPair(c, inner, outer);
                symbols.Add(s);

            }
            if(unknownsyms.Count > 0)
            {
                string symstring = "";
                foreach(string sym in unknownsyms)
                {
                    symstring += "," + sym;
                }
                symstring = symstring.Substring(1);
                MessageBox.Show(string.Format("The symbols list is incomplete, the following symbols are missing:\n{0}\nGeneration will be aborted.", symstring));
                return false;
            }
            else
            {
                return true;
            }
            
        }
        public bool checkColors(List<ministeck_block> blocks,Color c)
        {
            if(blocks.TrueForAll(b => b.fillcolor == c))
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        public void calculateColorMapping()
        {
            if(this.useColorMapping)
            {
                int count = 0;
                int minSquare = this.minSquareSize;
                 for (int i = 0; i < amounty; i++)
                {
                    for (int i2 = 0; i2 < amountx; i2++)
                    {
                        count++;
                        float percentageComplete = ((float)count / (float)blocks.Count) * 100;
                        Console.Write(string.Format("Calculating Colormap... {0}%", (int)percentageComplete));
                        if(!getBlock(i2,i).isInSquare)
                        {
                            int x = i2;
                            int y = i;
                            // get outlines from square
                            List<int> xCoordinates = new List<int>();
                            List<int> yCoordinates = new List<int>();
                            // get coordinates for top row
                            for(int i3 = 0; i3 < minSquare; i3++)
                            {
                                xCoordinates.Add(x + i3);
                                yCoordinates.Add(y);
                            }
                            if(this.checkColors(this.getblockarray(xCoordinates.ToArray(),yCoordinates.ToArray()).ToList<ministeck_block>(),getBlock(x,y).fillcolor))
                            {
                                // get coordinates for left column
                                for(int i3 = 0; i3 < minSquare; i3++)
                                {
                                    xCoordinates.Add(x);
                                    yCoordinates.Add(y + i3);
                                }
                                if(this.checkColors(this.getblockarray(xCoordinates.ToArray(),yCoordinates.ToArray()).ToList<ministeck_block>(),getBlock(x,y).fillcolor))
                                {
                                    // get coordinates for bottom row
                                    for(int i3 = 0; i3 < minSquare; i3++)
                                    {
                                        xCoordinates.Add(x + i3);
                                        yCoordinates.Add(y + minSquare);
                                    }
                                     if(this.checkColors(this.getblockarray(xCoordinates.ToArray(),yCoordinates.ToArray()).ToList<ministeck_block>(),getBlock(x,y).fillcolor))
                                     {
                                         // get coordinates for right column
                                         for (int i3 = 0; i3 < minSquare; i3++)
                                         {
                                             xCoordinates.Add(x + minSquare);
                                             yCoordinates.Add(y + i3);
                                         }
                                         if (this.checkColors(this.getblockarray(xCoordinates.ToArray(), yCoordinates.ToArray()).ToList<ministeck_block>(), getBlock(x, y).fillcolor))
                                         {
                                             xCoordinates.Clear();
                                             yCoordinates.Clear();
                                             // get coordinates of borders and inside
                                             for (int i3 = 0; i3 < minSquare; i3++)
                                             {
                                                 for (int i4 = 0; i4 < minSquare; i4++)
                                                 {
                                                     xCoordinates.Add(x + i3);
                                                     yCoordinates.Add(y + i4);
                                                 }
                                             }
                                             if (this.checkColors(this.getblockarray(xCoordinates.ToArray(), yCoordinates.ToArray()).ToList<ministeck_block>(), getBlock(x, y).fillcolor))
                                             {
                                                 // all blocks have the same color
                                                 foreach(ministeck_block b in this.getblockarray(xCoordinates.ToArray(), yCoordinates.ToArray()))
                                                 {
                                                     b.isInSquare = true;
                                                 }
                                                 this.ColorMap.Add(new ColorSquare(x, y, x + minSquare, y + minSquare, this.getBlock(x, y).fillcolor));
                                             }
                                         }
                                     }
                                }
                            }
                        }
                        
                    }
                }
            }
        }
        public void placeblocks(int height, int length, int amounthor, int amountver,string[] data)
        {
            amountx = amounthor;
            amounty = amountver;
            refpanel.Height = height * amountver;
            refpanel.Width = length * amounthor;
            for (int i = 0; i < amountver; i++)
            {
                for (int i2 = 0; i2 < amounthor; i2++)
                {
                    Color[] blockcolors = charToColor(data[i][i2]);
                    ministeck_block b = new ministeck_block(i2, i, 14, false, false, false, false, refpanel, blockcolors[0],blockcolors[1]);
                    blocks.Add(b);
                }
            }
            //progress.Maximum = blocks.Count;
        }
        public Color[] charToColor(char data)
        {
            foreach(symColorPair pair in symbols)
            {
                if(pair.symbol == data)
                {
                    Color[] result = {pair.color , pair.outer};
                    return result;
                }
            }
            Color[] defresult = { Color.White, Color.White };
            return defresult;
        }
        public void generate()
        {
            int count = 1;
            refform.worker.ReportProgress(blocks.Count);
            for (int i = 0; i < amounty; i++)
            {
                for (int i2 = 0; i2 < amountx; i2++)
                {
                    if(i2 > 49)
                    {

                    }
                    if (getBlock(i2, i).haspiece == false)
                    {
                        this.oldPieces.Clear();
                        generatePiece(i2, i);
                        this.currentTries = 0;
                        
                    }
                    float percentageComplete = ((float)count / (float)blocks.Count) * 100;
                    Console.Write(string.Format("Generating... {0}%",(int) percentageComplete));
                    count++;
                }
            }
            //progress.Value = 0;
        }
        public void paintblocks(Graphics g)
        {
            int count = 0;
            foreach (ministeck_block b in blocks)
            {
                b.paint(g);
                b.paintBorders(g);
                //progress.Value = count;
                //float percentageComplete = ((float)count / (float)blocks.Count) * 100;
                //Console.Write(string.Format("Painting... {0}%", (int)percentageComplete));
                count++;
            }
        }
        public void generatePiece(int x, int y)
        {
            this.currentTries++;
            bool sucsess = checkPieceAndPlace(getRandomPiece(), x, y);
            if (sucsess == false)
            {
                generatePiece(x, y);
            }
        }
        // Main algorythm DO NOT MODIFY!
        public bool checkPieceAndPlace(ministeck_piece p, int x, int y)
        {
            if(this.currentTries == this.maxTries)
            {
                p.piece_type = ministeck_piece.type.block;
            }
            if (!this.oldPieces.Contains(p.piece_type))
            {
                //Console.WriteLine("piece type: "+p.piece_type);
                switch (p.piece_type)
                {
                    case ministeck_piece.type.block:
                        ministeck_block bl = getBlock(x, y);
                        if (bl.haspiece == true)
                        {
                            //Console.WriteLine("piece won't fit!");
                            this.oldPieces.Add(p.piece_type);
                            return false;
                        }
                        else
                        {
                            bl.leftborder = true;
                            bl.topborder = true;
                            bl.bottomborder = true;
                            bl.rightborder = true;
                            return true;
                        }
                    case ministeck_piece.type.straight2:
                        int[] xs = { x, x + 1 };
                        int[] ys = { y, y };
                        ministeck_block[] ajacentblocks = getblockarray(xs, ys);
                        Color c = ajacentblocks[0].fillcolor;
                        foreach (ministeck_block b in ajacentblocks)
                        {
                            if (b.haspiece == true || b.fillcolor != c)
                            {
                                //Console.WriteLine("piece won't fit!");
                                this.oldPieces.Add(p.piece_type);
                                return false;
                            }
                        }
                        ajacentblocks[0].leftborder = true;
                        ajacentblocks[0].topborder = true;
                        ajacentblocks[0].bottomborder = true;
                        ajacentblocks[1].rightborder = true;
                        ajacentblocks[1].topborder = true;
                        ajacentblocks[1].bottomborder = true;
                        ajacentblocks[0].haspiece = true;
                        ajacentblocks[1].haspiece = true;
                        return true;
                    case ministeck_piece.type.straight2down:
                        int[] xs2 = { x, x };
                        int[] ys2 = { y, y + 1 };
                        ministeck_block[] ajacentblocks2 = getblockarray(xs2, ys2);
                        Color c2 = ajacentblocks2[0].fillcolor;
                        foreach (ministeck_block b in ajacentblocks2)
                        {
                            if (b.haspiece == true || b.fillcolor != c2)
                            {
                                //Console.WriteLine("piece won't fit!");
                                this.oldPieces.Add(p.piece_type);
                                return false;
                            }
                        }
                        ajacentblocks2[0].leftborder = true;
                        ajacentblocks2[0].rightborder = true;
                        ajacentblocks2[0].topborder = true;
                        ajacentblocks2[1].leftborder = true;
                        ajacentblocks2[1].bottomborder = true;
                        ajacentblocks2[1].rightborder = true;
                        ajacentblocks2[0].haspiece = true;
                        ajacentblocks2[1].haspiece = true;
                        return true;
                    case ministeck_piece.type.straight3:
                        int[] xs3 = { x, x + 1, x + 2 };
                        int[] ys3 = { y, y, y };
                        ministeck_block[] ajacentblocks3 = getblockarray(xs3, ys3);
                        Color c3 = ajacentblocks3[0].fillcolor;
                        foreach (ministeck_block b in ajacentblocks3)
                        {
                            if (b.haspiece == true || b.fillcolor != c3)
                            {
                                //Console.WriteLine("piece won't fit!");
                                this.oldPieces.Add(p.piece_type);
                                return false;
                            }
                        }
                        ajacentblocks3[0].leftborder = true;
                        ajacentblocks3[0].topborder = true;
                        ajacentblocks3[0].bottomborder = true;
                        ajacentblocks3[1].bottomborder = true;
                        ajacentblocks3[1].topborder = true;
                        ajacentblocks3[2].rightborder = true;
                        ajacentblocks3[2].topborder = true;
                        ajacentblocks3[2].bottomborder = true;
                        ajacentblocks3[0].haspiece = true;
                        ajacentblocks3[1].haspiece = true;
                        ajacentblocks3[2].haspiece = true;
                        return true;
                    case ministeck_piece.type.straight3down:
                        int[] xs4 = { x, x, x };
                        int[] ys4 = { y, y + 1, y + 2 };
                        ministeck_block[] ajacentblocks4 = getblockarray(xs4, ys4);
                        Color c5 = ajacentblocks4[0].fillcolor;
                        foreach (ministeck_block b in ajacentblocks4)
                        {
                            if (b.haspiece == true || b.fillcolor != c5)
                            {
                                // Console.WriteLine("piece won't fit!");
                                this.oldPieces.Add(p.piece_type);
                                return false;
                            }
                        }
                        ajacentblocks4[0].leftborder = true;
                        ajacentblocks4[0].topborder = true;
                        ajacentblocks4[0].rightborder = true;
                        ajacentblocks4[1].leftborder = true;
                        ajacentblocks4[1].rightborder = true;
                        ajacentblocks4[2].leftborder = true;
                        ajacentblocks4[2].bottomborder = true;
                        ajacentblocks4[2].rightborder = true;
                        ajacentblocks4[0].haspiece = true;
                        ajacentblocks4[1].haspiece = true;
                        ajacentblocks4[2].haspiece = true;
                        return true;
                    case ministeck_piece.type.fullblock:
                        //Console.WriteLine("FULLBLOCKPIECE!");
                        int[] xs5 = { x, x + 1, x, x + 1 };
                        int[] ys5 = { y, y, y + 1, y + 1 };
                        ministeck_block[] ajacentblocks5 = getblockarray(xs5, ys5);
                        Color c6 = ajacentblocks5[0].fillcolor;
                        foreach (ministeck_block b in ajacentblocks5)
                        {
                            if (b.haspiece == true || b.fillcolor != c6)
                            {
                                //Console.WriteLine("piece won't fit!");
                                this.oldPieces.Add(p.piece_type);
                                return false;
                            }
                        }
                        ajacentblocks5[0].leftborder = true;
                        ajacentblocks5[0].topborder = true;
                        ajacentblocks5[1].rightborder = true;
                        ajacentblocks5[1].topborder = true;
                        ajacentblocks5[2].leftborder = true;
                        ajacentblocks5[2].bottomborder = true;
                        ajacentblocks5[3].rightborder = true;
                        ajacentblocks5[3].bottomborder = true;
                        ajacentblocks5[0].haspiece = true;
                        ajacentblocks5[1].haspiece = true;
                        ajacentblocks5[2].haspiece = true;
                        ajacentblocks5[3].haspiece = true;
                        return true;
                    case ministeck_piece.type.L:
                        int[] xs6 = { x, x, x + 1 };
                        int[] ys6 = { y, y + 1, y + 1 };
                        ministeck_block[] ajacentblocks6 = getblockarray(xs6, ys6);
                        Color c7 = ajacentblocks6[0].fillcolor;
                        foreach (ministeck_block b in ajacentblocks6)
                        {
                            if (b.haspiece == true || b.fillcolor != c7)
                            {
                                // Console.WriteLine("piece won't fit!");
                                this.oldPieces.Add(p.piece_type);
                                return false;
                            }
                        }
                        ajacentblocks6[0].leftborder = true;
                        ajacentblocks6[0].rightborder = true;
                        ajacentblocks6[0].topborder = true;
                        ajacentblocks6[1].leftborder = true;
                        ajacentblocks6[1].bottomborder = true;
                        ajacentblocks6[2].rightborder = true;
                        ajacentblocks6[2].topborder = true;
                        ajacentblocks6[2].bottomborder = true;
                        ajacentblocks6[0].haspiece = true;
                        ajacentblocks6[1].haspiece = true;
                        ajacentblocks6[2].haspiece = true;
                        ajacentblocks6[1].needpixelL = true;
                        return true;
                    case ministeck_piece.type.L2:
                        int[] xs7 = { x, x, x + 1 };
                        int[] ys7 = { y, y + 1, y };
                        ministeck_block[] ajacentblocks7 = getblockarray(xs7, ys7);
                        Color c8 = ajacentblocks7[0].fillcolor;
                        foreach (ministeck_block b in ajacentblocks7)
                        {
                            if (b.haspiece == true || b.fillcolor != c8)
                            {
                                // Console.WriteLine("piece won't fit!");
                                this.oldPieces.Add(p.piece_type);
                                return false;
                            }
                        }
                        ajacentblocks7[0].leftborder = true;
                        ajacentblocks7[0].topborder = true;
                        ajacentblocks7[1].leftborder = true;
                        ajacentblocks7[1].bottomborder = true;
                        ajacentblocks7[1].rightborder = true;
                        ajacentblocks7[2].rightborder = true;
                        ajacentblocks7[2].topborder = true;
                        ajacentblocks7[2].bottomborder = true;
                        ajacentblocks7[0].haspiece = true;
                        ajacentblocks7[1].haspiece = true;
                        ajacentblocks7[2].haspiece = true;
                        ajacentblocks7[0].needpixelL = true;

                        return true;
                    case ministeck_piece.type.L3:
                        int[] xs8 = { x, x + 1, x + 1 };
                        int[] ys8 = { y, y, y + 1 };
                        ministeck_block[] ajacentblocks8 = getblockarray(xs8, ys8);
                        Color c9 = ajacentblocks8[0].fillcolor;
                        foreach (ministeck_block b in ajacentblocks8)
                        {
                            if (b.haspiece == true || b.fillcolor != c9)
                            {
                                // Console.WriteLine("piece won't fit!");
                                this.oldPieces.Add(p.piece_type);
                                return false;
                            }
                        }
                        ajacentblocks8[0].leftborder = true;
                        ajacentblocks8[0].topborder = true;
                        ajacentblocks8[0].bottomborder = true;
                        ajacentblocks8[1].topborder = true;
                        ajacentblocks8[1].rightborder = true;
                        ajacentblocks8[2].rightborder = true;
                        ajacentblocks8[2].leftborder = true;
                        ajacentblocks8[2].bottomborder = true;
                        ajacentblocks8[0].haspiece = true;
                        ajacentblocks8[1].haspiece = true;
                        ajacentblocks8[2].haspiece = true;
                        ajacentblocks8[1].needpixelL = true;
                        return true;

                    case ministeck_piece.type.L4:
                        int[] xs9 = { x, x, x - 1 };
                        int[] ys9 = { y, y + 1, y + 1 };
                        ministeck_block[] ajacentblocks9 = getblockarray(xs9, ys9);
                        Color c10 = ajacentblocks9[0].fillcolor;
                        foreach (ministeck_block b in ajacentblocks9)
                        {
                            if (b.haspiece == true || b.fillcolor != c10)
                            {
                                // Console.WriteLine("piece won't fit!");
                                this.oldPieces.Add(p.piece_type);
                                return false;
                            }
                        }
                        ajacentblocks9[0].leftborder = true;
                        ajacentblocks9[0].topborder = true;
                        ajacentblocks9[0].rightborder = true;
                        ajacentblocks9[1].bottomborder = true;
                        ajacentblocks9[1].rightborder = true;
                        ajacentblocks9[2].topborder = true;
                        ajacentblocks9[2].leftborder = true;
                        ajacentblocks9[2].bottomborder = true;
                        ajacentblocks9[0].haspiece = true;
                        ajacentblocks9[1].haspiece = true;
                        ajacentblocks9[2].haspiece = true;
                        ajacentblocks9[1].needpixelL = true;
                        return true;
                    default:
                        return false;



                }
            }
            else
            {
                return false;
            }
        }
        public ministeck_block[] getblockarray(int[] xs, int[] ys)
        {
            List<ministeck_block> blocklist = new List<ministeck_block>();
            if (xs.Length == ys.Length)
            {
                for (int i = 0; i < xs.Length; i++)
                {
                    blocklist.Add(getBlock(xs[i], ys[i]));
                }
                return blocklist.ToArray();
            }
            else
            {
                throw new Exception("uneven coordinates!");
            }
        }
        public ministeck_block getBlock(int x, int y)
        {
            if (x > amountx || y > amounty)
            {
                return errorblock;
            }
            else
            {
                int count = 1;
                for (int i = 0; i < blocks.Count; i++)
                {
                    count++;
                    int xx = blocks.ToArray()[i].xpos;
                    int yy = blocks.ToArray()[i].ypos;
                   // Console.WriteLine(blocks.ToArray()[i].xpos);
                    //Console.WriteLine(blocks.ToArray()[i].ypos);
                    if (xx == x && yy == y)
                    {
                        return blocks.ToArray()[i];
                    }
                }
                return errorblock;
            }
        }
        public ministeck_piece getRandomPiece()
        {
            return pieces.ToArray()[r.Next(0, 10)];
        }
        public void test()
        {
            foreach(ministeck_block b in blocks)
            {
                Console.WriteLine(b.ypos);
            }
        }
        public void loadpieces()
        {
            pieces.Add(new ministeck_piece(ministeck_piece.type.block,Color.Black));
            pieces.Add(new ministeck_piece(ministeck_piece.type.straight2, Color.Black));
            pieces.Add(new ministeck_piece(ministeck_piece.type.straight3, Color.Black));
            pieces.Add(new ministeck_piece(ministeck_piece.type.straight2down, Color.Black));
            pieces.Add(new ministeck_piece(ministeck_piece.type.straight3down, Color.Black));
            pieces.Add(new ministeck_piece(ministeck_piece.type.L, Color.Black));
            pieces.Add(new ministeck_piece(ministeck_piece.type.L2, Color.Black));
            pieces.Add(new ministeck_piece(ministeck_piece.type.L3, Color.Black));
            pieces.Add(new ministeck_piece(ministeck_piece.type.L4, Color.Black));
            pieces.Add(new ministeck_piece(ministeck_piece.type.fullblock, Color.Black));

        }
    }
}

