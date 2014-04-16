
function curve()
{
  this.M_PI = 3.14159265358979323846;

  this.thickness = 16;
  this.usesteps = 0;
  this.totalstep = 0;
  this.innerdrop = 0;
  this.outerdrop = 0;
  this.hill = 1;
  this.ct = 1;
  this.r0 = 128;
  this.r1 = 256;
  this.r2 = 128;
  this.r3 = 256;
  this.n  = 16;

  this.a0 = 0;
  this.a1 = 180;

  this.toptex    = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true, side:THREE.DoubleSide } );
  this.intex     = new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe: true, side:THREE.DoubleSide } );
  this.outtex    = new THREE.MeshBasicMaterial( { color: 0x0000ff, wireframe: true, side:THREE.DoubleSide } );
  this.bottex    = new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: false, side:THREE.DoubleSide } );
  this.blanktex  = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true, side:THREE.DoubleSide } );

  this.rndnum = function(min, max) {
    return Math.floor(min + Math.random()*(max-min));
  }

  //alert(typeof(this['a1']));
  this.setvalue = function(elem, value) {
      if (typeof(this[elem]) == 'number')
	  this[elem] = parseFloat(value);
  }
  this.getvalue = function(elem) {
      if (typeof(this[elem]) == 'number')
	  return this[elem];
      return 0;
  }

  this.random = function() {
      this.r0 = this.rndnum(0, 256/8) * 8; this.r2=this.r0;

      this.r1 = this.r0 + this.rndnum(8/8, 256/8) * 8; this.r3=this.r1;

      if (this.rndnum(1,100)<=40)
	  this.r2 = this.rndnum(0,256/8) * 8;
      if (this.rndnum(1,100)<=40)
	  this.r3 = this.r2 + this.rndnum(8/8,256/8) * 8;

      this.a0 = this.rndnum(0,7) * 45;
      this.a1 = this.a0 + (this.rndnum(2,16) * 45);

      this.n = (this.a1-this.a0) / 12;

      if (this.rndnum(1,100)<=50)
	  this.thickness = this.rndnum(8/8,64/8) * 8;
      else
	  this.thickness = this.rndnum(1,2) * 128;

      if (this.rndnum(1,100)<=40)
	  this.totalstep = this.rndnum(1,16) * 32;
      else
	  this.totalstep = 0;

      this.innerdrop = 0;
      this.outerdrop = 0;
      if (this.rndnum(1,100)<=40) {
	  if (this.rndnum(1,100)<=50) {
	      if (this.thickness>8) {
		  this.innerdrop = this.rndnum(1,(this.thickness - 8)/8) * 8;
		  this.usesteps = 1;
	      }
	  } else {
	      if (this.thickness>8) {
		  this.outerdrop = this.rndnum(1,(this.thickness - 8)/8) * 8;
		  this.usesteps = 1;
	      }
	  }
      }

      this.hill = 0;
      if (this.rndnum(1,100)<=40) {
	  if (this.thickness>16) {
	      this.hill = this.rndnum(2,(this.thickness - 16)/8) * 8;
	      this.usesteps = 1;
	  }
      }

      this.ct = 1;
      if (this.rndnum(1,100)<=25)
	  this.ct=0;

  }

  this.side = function(x0, y0, z0, x1, y1, z1, x2, y2, z2, tex) {
/*
    var geom = new THREE.Geometry();
    geom.vertices.push( new THREE.Vector3( x0, y0, z0 ) );
    geom.vertices.push( new THREE.Vector3( x1, y1, z1 ) );
    geom.vertices.push( new THREE.Vector3( x2, y2, z2 ) );
    geom.vertices.push( new THREE.Vector3( (x1 + x2 - x0), (y1 + y2 - y0), (z1 + z2 - z0) ) );

    geom.faces.push(new THREE.Face4(0, 1, 2, 3));

    mesh = new THREE.Mesh(geom, tex);
    mesh.position.set(0.0, 0.0, 0.0);
    scene.add(mesh);
*/

      var geom = new THREE.Geometry();

      geom.vertices.push( new THREE.Vector3( x0, y0, z0 ) );
      geom.vertices.push( new THREE.Vector3( x1, y1, z1 ) );
      geom.vertices.push( new THREE.Vector3( x2, y2, z2 ) );
      geom.vertices.push( new THREE.Vector3( (x1 + x2 - x0), (y1 + y2 - y0), (z1 + z2 - z0) ) );

      geom.faces.push( new THREE.Face3( 2, 1, 0 ) );
      geom.faces.push( new THREE.Face3( 1, 2, 3 ) );

      geom.faces.push( new THREE.Face3( 0, 1, 2 ) );
      geom.faces.push( new THREE.Face3( 3, 2, 1 ) );

      var mesh = new THREE.Mesh( geom, tex );

      meshes.push(mesh);

      scene.add( mesh );
  }

  this.lump = function(r0, r1, a0, a1, i, n) {
      var x00 = (r0+((this.r2-r0)*((i)/n))) * Math.cos(this.M_PI * a0 / 180.0);
      var y00 = (r0+((this.r2-r0)*((i)/n))) * Math.sin(this.M_PI * a0 / 180.0);

      var x10 = (r1+((this.r3-r1)*((i)/n))) * Math.cos(this.M_PI * a0 / 180.0);
      var y10 = (r1+((this.r3-r1)*((i)/n))) * Math.sin(this.M_PI * a0 / 180.0);

      var x01 = (r0+((this.r2-r0)*((i+1.0)/n))) * Math.cos(this.M_PI * a1 / 180.0);
      var y01 = (r0+((this.r2-r0)*((i+1.0)/n))) * Math.sin(this.M_PI * a1 / 180.0);

      var x11 = (r1+((this.r3-r1)*((i+1.0)/n))) * Math.cos(this.M_PI * a1 / 180.0);
      var y11 = (r1+((this.r3-r1)*((i+1.0)/n))) * Math.sin(this.M_PI * a1 / 180.0);

      var z0  = 0;
      var z1  = this.thickness;

      if (!this.usesteps) {
	  /*just use rlk's code    */
	  this.side(x00, y00, z0, x01, y01, z0, x00, y00, z1, this.intex);
	  this.side(x10, y10, z1, x11, y11, z1, x10, y10, z0, this.outtex);
	  this.side(x00, y00, z1, x10, y10, z1, x00, y00, z0, this.blanktex);
	  this.side(x01, y01, z0, x11, y11, z0, x01, y01, z1, this.blanktex);

	  this.side(0, 0, z0, 1, 0, z0, 0, 1, z0, this.bottex);
	  this.side(0, 0, z1, 0, 1, z1, 1, 0, z1, this.toptex);
      } else {
	  /*use Dave's code! */
	  var stepsize = this.totalstep/n;
	  var zmod0=i * stepsize;
	  var zmod1=(i+1) * stepsize; /*this goes up!  */
	  var hillmodinside=0;
	  var hillmodoutside=0;
	  var hmi2=0;
	  var hmo2=0;
	  var cthi1=0;
	  var cthi2=0;
	  var ctho1=0;
	  var ctho2=0;

        if (this.hill != 0) {
            /*do one based on sinewave. */
            var mult1=((Math.sin((((360.0/n)*i)-90.0) * this.M_PI / 180.0)+1.0)/2.0);
            var mult2=((Math.sin((((360.0/n)*(i+1))-90.0) * this.M_PI / 180.0)+1.0)/2.0);
            if (this.innerdrop>=this.outerdrop) {
                /*then it's the outside needs altered   */
                hillmodoutside=this.hill-(mult1*this.hill) ;
                hmo2=this.hill-(mult2*this.hill) ;
                ctho1=this.hill-hillmodoutside;
                ctho2=this.hill-hmo2;
            }
            if (this.outerdrop>=this.innerdrop) {
                hillmodinside=this.hill-(mult1*this.hill) ;
                hmi2=this.hill-(mult2*this.hill) ;
                cthi1=this.hill-hillmodinside;
                cthi2=this.hill-hmi2;
            }
	    /*end of sinewave hill code*/
            if (this.innerdrop>this.outerdrop) {
                cthi1-=hillmodoutside; cthi2-=hmo2;
                ctho1=0; ctho2=0;
            }
	    if (this.outerdrop>this.innerdrop ) {
		ctho1-=hillmodinside; ctho2-=hmi2;
		cthi1=0; cthi2=0;
	    }
        } /*end of "hill" code */

	  /*
            00 is bottom left
            10 is bottom right
            11 is top right
            01 is top left
	  */

	  this.side(x11, y11, ((z1+zmod1)-this.outerdrop)-hmo2,             x10, y10, ((z1+zmod0)-this.outerdrop)-hillmodoutside, x00, y00, ((z1+zmod0)-this.innerdrop)-hillmodinside, this.toptex);
	  this.side(x00, y00, z0+zmod0+((this.outerdrop+ctho1)*this.ct),    x10, y10, z0+zmod0+((this.innerdrop+cthi1)*this.ct),      x11, y11, z0+zmod1+((this.innerdrop+cthi2)*this.ct),       this.bottex);
	  this.side(x11, y11, ((z1+zmod1)-this.outerdrop)-hmo2,             x11, y11, z0+zmod1+((this.innerdrop+cthi2)*this.ct),      x10, y10, z0+zmod0+((this.innerdrop+cthi1)*this.ct),       this.outtex);
	  this.side(x10, y10, ((z1+zmod0)-this.outerdrop)-hillmodoutside,   x10, y10, z0+zmod0+((this.innerdrop+cthi1)*this.ct),      x00, y00, z0+zmod0+((this.outerdrop+ctho1)*this.ct),       this.blanktex);
	  this.side(x11, y11, ((z1+zmod1)-this.outerdrop)-hmo2,             x00, y00, z0+zmod0+((this.outerdrop+ctho1)*this.ct),      x11, y11, z0+zmod1+((this.innerdrop+cthi2)*this.ct),       this.blanktex);


	  this.side(x00, y00, ((z1+zmod0)-this.innerdrop)-hillmodinside,    x01, y01, ((z1+zmod1)-this.innerdrop)-hmi2,          x11, y11, ((z1+zmod1)-this.outerdrop)-hmo2,           this.toptex);
	  this.side(x11, y11, z0+zmod1+((this.innerdrop+cthi2)*this.ct),         x01, y01, z0+zmod1+((this.outerdrop+ctho2)*this.ct),      x00, y00, z0+zmod0+((this.outerdrop+ctho1)*this.ct),       this.bottex);
	  this.side(x00, y00, ((z1+zmod0)-this.innerdrop)-hillmodinside,    x00, y00, z0+zmod0+((this.outerdrop+ctho1)*this.ct),      x01, y01, z0+zmod1+((this.outerdrop+ctho2)*this.ct),       this.intex);
	  this.side(x01, y01, ((z1+zmod1)-this.innerdrop)-hmi2,             x01, y01, z0+zmod1+((this.outerdrop+ctho2)*this.ct),      x11, y11, z0+zmod1+((this.innerdrop+cthi2)*this.ct),       this.blanktex);
	  this.side(x00, y00, ((z1+zmod0)-this.innerdrop)-hillmodinside,    x11, y11, z0+zmod1+((this.innerdrop+cthi2)*this.ct),      x00, y00, z0+zmod0+((this.outerdrop+ctho1)*this.ct),       this.blanktex);
      }
  }

  this.generate = function() {
      for (var i = 0; i < this.n; i++) {
	  var ai0 = (i    ) * (this.a1 - this.a0) / this.n + this.a0;
	  var ai1 = (i + 1) * (this.a1 - this.a0) / this.n + this.a0;
	  this.lump(this.r0, this.r1, ai0, ai1, i, this.n);
      }
  }

}