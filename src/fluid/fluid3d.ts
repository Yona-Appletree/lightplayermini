



// From https://github.com/BlainMaguire/3dfluid
//      https://github.com/BlainMaguire/3dfluid/blob/master/solver3d.c

export function Fluid3d(
	simSize: {x: number, y: number, z: number}
) {
	const { x: sizeX, y: sizeY, z: sizeZ } = simSize

	const dt = 0.4; // time delta
	const diff = 0.0; // diffuse
	const visc = 0.0; // viscosity
	const force = 10.0;  // added on keypress on an axis
	const source = 200.0; // density
	const source_alpha =  0.05; //for displaying density

	const addforce = [ 0, 0, 0 ];
	const addsource = 0;
	
	const size = (sizeY+2)*(sizeX+2)*(sizeZ+2);

	const u: number[] = Array(size).fill(0)
	const v: number[] = Array(size).fill(0)
	const w: number[] = Array(size).fill(0)
	const u_prev: number[] = Array(size).fill(0)
	const v_prev: number[] = Array(size).fill(0)
	const w_prev: number[] = Array(size).fill(0)
	const dens: number[] = Array(size).fill(0)
	const dens_prev: number[] = Array(size).fill(0)

	const int = Math.floor
	const IX = (i:number,j:number,k:number) => ((i)+(sizeY+2)*(j) + (sizeY+2)*(sizeX+2)*(k))
	const MAX = (a: number, b: number) => (((a) > (b)) ? (a) : (b))
	const LINEARSOLVERTIMES = 10

	const add_source = (x: number[], s: number[], dt: number ) =>
	{
		const size=(sizeY+2)*(sizeX+2)*(sizeZ+2);
		for ( let i=0 ; i<size ; i++ ) x[i] += dt*s[i];
	}

	const set_bnd = (b: number /* int */, x: number[] ) =>
	{

		// bounds are cells at faces of the cube

		//setting faces
		for ( let i=1 ; i<=sizeY ; i++ ) {
			for ( let j=1 ; j<=sizeX ; j++ ) {
				x[IX(i,j,0 )] = b==3 ? -x[IX(i,j,1)] : x[IX(i,j,1)];
				x[IX(i,j,sizeZ+1)] = b==3 ? -x[IX(i,j,sizeZ)] : x[IX(i,j,sizeZ)];
			}
		}

		for ( let i=1 ; i<=sizeX ; i++ ) {
			for ( let j=1 ; j<=sizeZ ; j++ ) {
				x[IX(0  ,i, j)] = b==1 ? -x[IX(1,i,j)] : x[IX(1,i,j)];
				x[IX(sizeY+1,i, j)] = b==1 ? -x[IX(sizeY,i,j)] : x[IX(sizeY,i,j)];
			}
		}

		for ( let i=1 ; i<=sizeY ; i++ ) {
			for ( let j=1 ; j<=sizeZ ; j++ ) {
				x[IX(i,0,j )] = b==2 ? -x[IX(i,1,j)] : x[IX(i,1,j)];
				x[IX(i,sizeX+1,j)] = b==2 ? -x[IX(i,sizeX,j)] : x[IX(i,sizeX,j)];
			}
		}

		//Setting edges
		for ( let i=1; i<=sizeY; i++) {
			x[IX(i,  0,  0)] = 1.0/2.0*(x[IX(i,1,  0)]+x[IX(i,  0,  1)]);
			x[IX(i,sizeX+1,  0)] = 1.0/2.0*(x[IX(i,sizeX,  0)]+x[IX(i,sizeX+1,  1)]);
			x[IX(i,  0,sizeZ+1)] = 1.0/2.0*(x[IX(i,0,  sizeZ)]+x[IX(i,  1,sizeZ+1)]);
			x[IX(i,sizeX+1,sizeZ+1)] = 1.0/2.0*(x[IX(i,sizeX,sizeZ+1)]+x[IX(i,sizeX+1,  sizeZ)]);
		}

		for ( let i=1; i<=sizeX; i++) {
			x[IX(0,  i,  0)] = 1.0/2.0*(x[IX(1,i,  0)]+x[IX(0,  i,  1)]);
			x[IX(sizeY+1,i,  0)] = 1.0/2.0*(x[IX(sizeY,i,  0)]+x[IX(sizeY+1,i,  1)]);
			x[IX(0,  i,sizeZ+1)] = 1.0/2.0*(x[IX(0,i,  sizeZ)]+x[IX(1,  i,sizeZ+1)]);
			x[IX(sizeY+1,i,sizeZ+1)] = 1.0/2.0*(x[IX(sizeY,i,sizeZ+1)]+x[IX(sizeY+1,i,  sizeZ)]);
		}

		for ( let i=1; i<=sizeZ; i++) {
			x[IX(0,  0,  i)] = 1.0/2.0*(x[IX(0,  1,i)]+x[IX(1,  0,  i)]);
			x[IX(0,  sizeX+1,i)] = 1.0/2.0*(x[IX(0,  sizeX,i)]+x[IX(1,  sizeX+1,i)]);
			x[IX(sizeY+1,0,  i)] = 1.0/2.0*(x[IX(sizeY,  0,i)]+x[IX(sizeY+1,1,  i)]);
			x[IX(sizeY+1,sizeX+1,i)] = 1.0/2.0*(x[IX(sizeY+1,sizeX,i)]+x[IX(sizeY,  sizeX+1,i)]);
		}

		//setting corners
		x[IX(0  ,0, 0  )] = 1.0/3.0*(x[IX(1,0,0  )]+x[IX(0  ,1,0)]+x[IX(0 ,0,1)]);
		x[IX(0  ,sizeX+1, 0)] = 1.0/3.0*(x[IX(1,sizeX+1, 0)]+x[IX(0  ,sizeX, 0)] + x[IX(0  ,sizeX+1, 1)]);

		x[IX(sizeY+1,0, 0 )] = 1.0/3.0*(x[IX(sizeY,0,0  )]+x[IX(sizeY+1,1,0)] + x[IX(sizeY+1,0,1)]) ;
		x[IX(sizeY+1,sizeX+1,0)] = 1.0/3.0*(x[IX(sizeY,sizeX+1,0)]+x[IX(sizeY+1,sizeX,0)]+x[IX(sizeY+1,sizeX+1,1)]);

		x[IX(0  ,0, sizeZ+1 )] = 1.0/3.0*(x[IX(1,0,sizeZ+1  )]+x[IX(0  ,1,sizeZ+1)]+x[IX(0 ,0,sizeZ)]);
		x[IX(0  ,sizeX+1, sizeZ+1)] = 1.0/3.0*(x[IX(1,sizeX+1, sizeZ+1)]+x[IX(0  ,sizeX, sizeZ+1)] + x[IX(0  ,sizeX+1, sizeZ)]);

		x[IX(sizeY+1,0, sizeZ+1 )] = 1.0/3.0*(x[IX(sizeY,0,sizeZ+1  )]+x[IX(sizeY+1,1,sizeZ+1)] + x[IX(sizeY+1,0,sizeZ)]) ;
		x[IX(sizeY+1,sizeX+1,sizeZ+1)] = 1.0/3.0*(x[IX(sizeY,sizeX+1,sizeZ+1)]+x[IX(sizeY+1,sizeX,sizeZ+1)]+x[IX(sizeY+1,sizeX+1,sizeZ)]);
	}

	const lin_solve = (b: number /* int */, x: number[], x0: number[], a: number, c: number ) =>
	{
		// iterate the solver
		for ( let l=0 ; l<LINEARSOLVERTIMES ; l++ ) {
			// update for each cell
			for ( let i=1 ; i<=sizeY ; i++ ) { for ( let j=1 ; j<=sizeX ; j++ ) { for ( let k=1 ; k<=sizeZ ; k++ ) {
				x[IX(i,j,k)] = (x0[IX(i,j,k)] + a*(x[IX(i-1,j,k)]+x[IX(i+1,j,k)]+x[IX(i,j-1,k)]+x[IX(i,j+1,k)]+x[IX(i,j,k-1)]+x[IX(i,j,k+1)]))/c;
			}}}
			set_bnd ( b, x );
		}
	}

	const diffuse = ( b: number /* int */, x: number[], x0: number[], diff: number, dt: number ) =>
	{
		const max: number /* int */ = MAX(MAX(sizeY, sizeX), MAX(sizeX, sizeZ));
		const a=dt*diff*max*max*max;
		lin_solve ( b, x, x0, a, 1+6*a );
	}

	const advect = ( b: number /* int */, d: number[], d0: number[], u: number[], v: number[], w: number[], dt: number ) =>
	{
		let i: number /* int */
		let j: number /* int */
		let k: number /* int */
		let i0: number /* int */
		let j0: number /* int */
		let k0: number /* int */
		let i1: number /* int */
		let j1: number /* int */
		let k1: number /* int */

		let x: number
		let y: number
		let z: number
		let s0: number
		let t0: number
		let s1: number
		let t1: number
		let u1: number
		let u0: number
		let dtx: number
		let dty: number
		let dtz: number

		dtx=dty=dtz=dt*MAX(MAX(sizeY, sizeX), MAX(sizeX, sizeZ));

		for ( i=1 ; i<=sizeY ; i++ ) { for ( j=1 ; j<=sizeX ; j++ ) { for ( k=1 ; k<=sizeZ ; k++ ) {
			x = i-dtx*u[IX(i,j,k)]; y = j-dty*v[IX(i,j,k)]; z = k-dtz*w[IX(i,j,k)];
			if (x<0.5) x=0.5; if (x>sizeY+0.5) x=sizeY+0.5; i0=int(x); i1=i0+1;
			if (y<0.5) y=0.5; if (y>sizeX+0.5) y=sizeX+0.5; j0=int(y); j1=j0+1;
			if (z<0.5) z=0.5; if (z>sizeZ+0.5) z=sizeZ+0.5; k0=int(z); k1=k0+1;

			s1 = x-i0; s0 = 1-s1; t1 = y-j0; t0 = 1-t1; u1 = z-k0; u0 = 1-u1;
			d[IX(i,j,k)] = s0*(t0*u0*d0[IX(i0,j0,k0)]+t1*u0*d0[IX(i0,j1,k0)]+t0*u1*d0[IX(i0,j0,k1)]+t1*u1*d0[IX(i0,j1,k1)])+
				s1*(t0*u0*d0[IX(i1,j0,k0)]+t1*u0*d0[IX(i1,j1,k0)]+t0*u1*d0[IX(i1,j0,k1)]+t1*u1*d0[IX(i1,j1,k1)]);
		}}}

		set_bnd (b, d );
	}

	const project = (u: number[], v: number[], w: number[], p: number[], div: number[] ) =>
	{
		let i: number /* int */
		let j: number /* int */
		let k: number /* int */

		for ( i=1 ; i<=sizeY ; i++ ) { for ( j=1 ; j<=sizeX ; j++ ) { for ( k=1 ; k<=sizeZ ; k++ ) {
			div[IX(i,j,k)] = -1.0/3.0*((u[IX(i+1,j,k)]-u[IX(i-1,j,k)])/sizeY+(v[IX(i,j+1,k)]-v[IX(i,j-1,k)])/sizeY+(w[IX(i,j,k+1)]-w[IX(i,j,k-1)])/sizeY);
			p[IX(i,j,k)] = 0;
		}}}

		set_bnd ( 0, div ); set_bnd (0, p );

		lin_solve ( 0, p, div, 1, 6 );

		for ( i=1 ; i<=sizeY ; i++ ) { for ( j=1 ; j<=sizeX ; j++ ) { for ( k=1 ; k<=sizeZ ; k++ ) {
			u[IX(i,j,k)] -= 0.5*sizeY*(p[IX(i+1,j,k)]-p[IX(i-1,j,k)]);
			v[IX(i,j,k)] -= 0.5*sizeY*(p[IX(i,j+1,k)]-p[IX(i,j-1,k)]);
			w[IX(i,j,k)] -= 0.5*sizeY*(p[IX(i,j,k+1)]-p[IX(i,j,k-1)]);
		}}}

		set_bnd (  1, u ); set_bnd (  2, v );set_bnd (  3, w);
	}

	const dens_step = (x: number[], x0: number[], u: number[], v: number[], w: number[], diff: number, dt: number ) =>
	{
		add_source ( x, x0, dt );
		{const temp = x0; x0=x; x=temp}// SWAP ( x0, x );
		diffuse ( 0, x, x0, diff, dt );
		{const temp = x0; x0=x; x=temp}// SWAP ( x0, x );
		advect ( 0, x, x0, u, v, w, dt );
	}

	const vel_step = (u: number[], v: number[],  w: number[], u0: number[], v0: number[], w0: number[], visc: number, dt: number ) =>
	{
		add_source ( u, u0, dt );
		add_source ( v, v0, dt );
		add_source ( w, w0, dt );
		{const temp = u0; u0=u; u=temp} // SWAP ( u0, u );
		diffuse ( 1, u, u0, visc, dt );
		{const temp = v0; v0=v; v=temp} // SWAP ( v0, v );
		diffuse ( 2, v, v0, visc, dt );
		{const temp = w0; w0=w; w=temp} // SWAP ( w0, w );
		diffuse ( 3, w, w0, visc, dt );
		project ( u, v, w, u0, v0 );
		{const temp = u0; u0=u; u=temp} // SWAP ( u0, u );
		{const temp = v0; v0=v; v=temp} // SWAP ( v0, v );
		{const temp = w0; w0=w; w=temp} // SWAP ( w0, w );
		advect ( 1, u, u0, u0, v0, w0, dt );
		advect ( 2, v, v0, u0, v0, w0, dt );
		advect ( 3, w, w0, u0, v0, w0, dt );
		project ( u, v, w, u0, v0 );
	}

	const step_sim = () => {
		u_prev.fill(0);
		v_prev.fill(0);
		w_prev.fill(0);
		dens_prev.fill(0);

		vel_step ( u, v, w, u_prev, v_prev, w_prev, visc, dt );
		dens_step ( dens, dens_prev, u, v, w, diff, dt );
	}

	const put_fluid = (
		pos: { x: number, y: number, z: number },
		dir: { x: number, y: number, z: number },
		density: number
	) => {
		const clamp = (x: number) => x < 0 ? 0 : x > 1 ? 1 : x
		const index = IX(
			int(clamp(pos.x) * sizeX),
			int(clamp(pos.y) * sizeY),
			int(clamp(pos.z) * sizeZ),
		)

		dens[index] = density
		u[index] = dir.x
		v[index] = dir.y
		w[index] = dir.z
	}

	const fade_out = (
		by: number
	) => {
		for (let i=0; i<size; i++) dens[i] *= 1 - by
	}

	return {
		IX, u, v, w, dens, step_sim, put_fluid, fade_out
	}
}
