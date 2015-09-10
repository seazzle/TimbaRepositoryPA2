/**
 * tests timbaUtils function
 */
	describe('RochadeDateFormatterTest', function() {
		it('RochadeDate in format yyyyMMddhhmmss should return format dd.MM.yyyy', function() {
			expect(rochadeDateFormatter("20150301101233")).toEqual("01.03.2015");
			expect(rochadeDateFormatter("20130810091022")).toEqual("10.08.2013");
		});
		it('RochadeDate in format yyyyMMddhh should return format dd.MM.yyyy', function() {
			expect(rochadeDateFormatter("20150301")).toEqual("01.03.2015");
			expect(rochadeDateFormatter("20130810")).toEqual("10.08.2013");
		});
	});

	describe('GermanDateFormatterTest', function() {
		it('German Date in format dd.MM.yyy should return format yyyy-MM-dd', function() {
			expect(germanDateFormatter("20.03.2015")).toEqual("2015-03-20");
		});
	});

	describe('DateFormatterTest', function() {
		testDate = new Date(2015, 09, 07);
		it('date Object formatted to german date format dd.MM.yyyy', function() {
			expect(dateFormatter(testDate)).toEqual(("07.10.2015"));
		});
	});

	describe('removeItemTest', function() {
		testData = [ {
			"kurzbeschreibung" : "Constantin Krüger",
			"name" : "1472",
			"id" : 6418
		}, {
			"kurzbeschreibung" : "Alexander Schleif",
			"name" : "0839",
			"id" : 18007
		}, {
			"kurzbeschreibung" : "Peter Kaisinger",
			"name" : "0835",
			"id" : 18623
		}, {
			"kurzbeschreibung" : "Holger Mößner",
			"name" : "0015",
			"id" : 17587
		} ]
		
		expectation = [ {
			"kurzbeschreibung" : "Constantin Krüger",
			"name" : "1472",
			"id" : 6418
		}, {
			"kurzbeschreibung" : "Alexander Schleif",
			"name" : "0839",
			"id" : 18007
		}, {
			"kurzbeschreibung" : "Holger Mößner",
			"name" : "0015",
			"id" : 17587
		} ]

		removeItem(testData, "id", 18623);
		
		it('removes an object from the jsonArray', function() {
			expect(testData).toEqual(expectation);
		});
	});
	
	describe('getByIdTest', function() {
		it('Array of Objects which returns a single Object by its ID', function() {
			testData = [ {
				"kurzbeschreibung" : "Constantin Krüger",
				"name" : "1472",
				"id" : 6418
			}, {
				"kurzbeschreibung" : "Alexander Schleif",
				"name" : "0839",
				"id" : 18007
			}, {
				"kurzbeschreibung" : "Peter Kaisinger",
				"name" : "0835",
				"id" : 18623
			}, {
				"kurzbeschreibung" : "Holger Mößner",
				"name" : "0015",
				"id" : 17587
			} ]
			
			
			var objectByID=getById(testData, 18623);
			
			expect(objectByID.id).toEqual(18623);
			expect(objectByID.name).toEqual("0835");
			expect(objectByID.kurzbeschreibung).toEqual("Peter Kaisinger");
		});

	});