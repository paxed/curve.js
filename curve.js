
var M_PI = 3.14159265358979323846;

 var thickness = 16;
var usesteps = 0;
var totalstep = 0;
 var innerdrop = 0;
 var outerdrop = 0;
 var hill = 1;
 var ct = 1;
 var r0 = 128;
 var r1 = 256;
 var r2 = 128;
 var r3 = 256;
 var n  = 16;

 var a0 = 0;
 var a1 = 180;


var toptex    = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true, side:THREE.DoubleSide } );
var intex     = new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe: true, side:THREE.DoubleSide } );
var outtex    = new THREE.MeshBasicMaterial( { color: 0x0000ff, wireframe: true, side:THREE.DoubleSide } );
var bottex    = new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: false, side:THREE.DoubleSide } );
var blanktex  = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true, side:THREE.DoubleSide } );

function rndnum(min, max) {
    return Math.floor(min + Math.random()*(max-min));
}


function random_curve()
{
    r0 = rndnum(0, 256/8) * 8; r2=r0;

    r1 = r0 + rndnum(8/8, 256/8) * 8; r3=r1;

    if (rndnum(1,100)<=40)
        r2 = rndnum(0,256/8) * 8;
    if (rndnum(1,100)<=40)
        r3 = r2 + rndnum(8/8,256/8) * 8;

    a0 = rndnum(0,7) * 45;
    a1 = a0 + (rndnum(2,16) * 45);

    n = (a1-a0) / 12;

    if (rndnum(1,100)<=50)
        thickness = rndnum(8/8,64/8) * 8;
    else
        thickness = rndnum(1,2) * 128;

    if (rndnum(1,100)<=40)
        totalstep = rndnum(1,16) * 32;
    else
        totalstep = 0;

    innerdrop = 0;
    outerdrop = 0;
    if (rndnum(1,100)<=40)
    {
        if (rndnum(1,100)<=50)
        {
            if (thickness>8)
            {
                innerdrop = rndnum(1,(thickness - 8)/8) * 8;
                usesteps = 1;
            }
        }
        else
        {
            if (thickness>8)
            {
                outerdrop = rndnum(1,(thickness - 8)/8) * 8;
                usesteps = 1;
            }
        }
    }

    hill = 0;
    if (rndnum(1,100)<=40)
    {
        if (thickness>16)
        {
            hill = rndnum(2,(thickness - 16)/8) * 8;
            usesteps = 1;
        }
    }

    ct = 1;
    if (rndnum(1,100)<=25)
        ct=0;

}

function side(x0, y0, z0, x1, y1, z1, x2, y2, z2, tex) {
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

function lump(r0, r1, a0, a1, i, n) {
    var x00 = (r0+((r2-r0)*((i)/n))) * Math.cos(M_PI * a0 / 180.0);
    var y00 = (r0+((r2-r0)*((i)/n))) * Math.sin(M_PI * a0 / 180.0);

    var x10 = (r1+((r3-r1)*((i)/n))) * Math.cos(M_PI * a0 / 180.0);
    var y10 = (r1+((r3-r1)*((i)/n))) * Math.sin(M_PI * a0 / 180.0);

    var x01 = (r0+((r2-r0)*((i+1.0)/n))) * Math.cos(M_PI * a1 / 180.0);
    var y01 = (r0+((r2-r0)*((i+1.0)/n))) * Math.sin(M_PI * a1 / 180.0);

    var x11 = (r1+((r3-r1)*((i+1.0)/n))) * Math.cos(M_PI * a1 / 180.0);
    var y11 = (r1+((r3-r1)*((i+1.0)/n))) * Math.sin(M_PI * a1 / 180.0);

    var z0  = 0;
    var z1  = thickness;

    if (!usesteps) {
        /*just use rlk's code    */
        side(x00, y00, z0, x01, y01, z0, x00, y00, z1, intex);
        side(x10, y10, z1, x11, y11, z1, x10, y10, z0, outtex);
        side(x00, y00, z1, x10, y10, z1, x00, y00, z0, blanktex);
        side(x01, y01, z0, x11, y11, z0, x01, y01, z1, blanktex);

	side(0, 0, z0, 1, 0, z0, 0, 1, z0, bottex);
        side(0, 0, z1, 0, 1, z1, 1, 0, z1, toptex);
    } else {

        /*use Dave's code! */
        var stepsize = totalstep/n;
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

        if (hill != 0)
        {
            /*do one based on sinewave. */
            var mult1=((Math.sin((((360.0/n)*i)-90.0) * M_PI / 180.0)+1.0)/2.0);
            var mult2=((Math.sin((((360.0/n)*(i+1))-90.0) * M_PI / 180.0)+1.0)/2.0);
            if (innerdrop>=outerdrop)
            {
                /*then it's the outside needs altered   */
                hillmodoutside=hill-(mult1*hill) ;
                hmo2=hill-(mult2*hill) ;
                ctho1=hill-hillmodoutside;
                ctho2=hill-hmo2;
            }
            if (outerdrop>=innerdrop)
            {
                hillmodinside=hill-(mult1*hill) ;
                hmi2=hill-(mult2*hill) ;
                cthi1=hill-hillmodinside;
                cthi2=hill-hmi2;
            }
               /*end of sinewave hill code*/
            if (innerdrop>outerdrop)
            {
                cthi1-=hillmodoutside; cthi2-=hmo2;
                ctho1=0; ctho2=0;
            }
             if (outerdrop>innerdrop )
                         {ctho1-=hillmodinside; ctho2-=hmi2;
                          cthi1=0; cthi2=0; }
        } /*end of "hill" code */

        /*
            00 is bottom left
            10 is bottom right
            11 is top right
            01 is top left
        */

        side(x11, y11, ((z1+zmod1)-outerdrop)-hmo2,             x10, y10, ((z1+zmod0)-outerdrop)-hillmodoutside, x00, y00, ((z1+zmod0)-innerdrop)-hillmodinside, toptex);
        side(x00, y00, z0+zmod0+((outerdrop+ctho1)*ct),         x10, y10, z0+zmod0+((innerdrop+cthi1)*ct),      x11, y11, z0+zmod1+((innerdrop+cthi2)*ct),       bottex);
        side(x11, y11, ((z1+zmod1)-outerdrop)-hmo2,             x11, y11, z0+zmod1+((innerdrop+cthi2)*ct),      x10, y10, z0+zmod0+((innerdrop+cthi1)*ct),       outtex);
        side(x10, y10, ((z1+zmod0)-outerdrop)-hillmodoutside,   x10, y10, z0+zmod0+((innerdrop+cthi1)*ct),      x00, y00, z0+zmod0+((outerdrop+ctho1)*ct),       blanktex);
        side(x11, y11, ((z1+zmod1)-outerdrop)-hmo2,             x00, y00, z0+zmod0+((outerdrop+ctho1)*ct),      x11, y11, z0+zmod1+((innerdrop+cthi2)*ct),       blanktex);


        side(x00, y00, ((z1+zmod0)-innerdrop)-hillmodinside,    x01, y01, ((z1+zmod1)-innerdrop)-hmi2,          x11, y11, ((z1+zmod1)-outerdrop)-hmo2,           toptex);
        side(x11, y11, z0+zmod1+((innerdrop+cthi2)*ct),         x01, y01, z0+zmod1+((outerdrop+ctho2)*ct),      x00, y00, z0+zmod0+((outerdrop+ctho1)*ct),       bottex);
        side(x00, y00, ((z1+zmod0)-innerdrop)-hillmodinside,    x00, y00, z0+zmod0+((outerdrop+ctho1)*ct),      x01, y01, z0+zmod1+((outerdrop+ctho2)*ct),       intex);
        side(x01, y01, ((z1+zmod1)-innerdrop)-hmi2,             x01, y01, z0+zmod1+((outerdrop+ctho2)*ct),      x11, y11, z0+zmod1+((innerdrop+cthi2)*ct),       blanktex);
        side(x00, y00, ((z1+zmod0)-innerdrop)-hillmodinside,    x11, y11, z0+zmod1+((innerdrop+cthi2)*ct),      x00, y00, z0+zmod0+((outerdrop+ctho1)*ct),       blanktex);

    }

}

function generate_curve() {

    for (var i = 0; i < n; i++) {
        var ai0 = (i    ) * (a1 - a0) / n + a0;
        var ai1 = (i + 1) * (a1 - a0) / n + a0;

        lump(r0, r1, ai0, ai1, i, n);
    }

}
