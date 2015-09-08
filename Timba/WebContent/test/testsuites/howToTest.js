/**
 * 
 */
	describe('How Testing JS Works', function() {
		//the 'spec' in the describe block describes a logical group of tests
		it('without a test body --> pending spec');
		it('with a test body: 1 + 1 should equal 2', function() {
			expect(1 + 1).toBe(2);
			/**
			expect(true).toBe(true);
			expect(false).not.toBe(true);
			   expect(1).toEqual(1);
			  expect('foo').toEqual('foo');
				expect('foo').not.toEqual('bar');
				expect( function(){ parser.parse(raw); } ).toThrow(new Error("Parsing is not possible"));
			 **/
		});
	});