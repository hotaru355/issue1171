var loopback = require('loopback');
var server = require('../../server/server')

module.exports = function(Parent) {

	Parent.simple =  function(body, cb) {
		var Child = server.models.Child;

		Parent.create(body, function(err, parent) {
			if (!body.children) {
				return cb(Error('We actually trying to create children along with the parent here ;)'));
			}

			var children = body.children.map(function(child) {
				child.parentId = parent.parentId;
				return child;
			});

			Child.create(children, function (err, children) {
				Parent.find({
					where: {
						parentId: parent.parentId
					},
					include: 'children'
				}, cb);
			});
		})
	}

	loopback.remoteMethod(
		Parent.simple, {
			accepts: [{
				arg: 'body',
				type: 'object',
				required: true,
				'http': {
					source: 'body'
				}
			}],
			returns: {
				arg: 'result',
				type: 'object',
				root: true
			},
			http: {
				path: '/simple',
				verb: 'post'
			},
			description: 'The simplest, but also most cumbersome aproach: setting child IDs in code.'
		}
	);


	Parent.advancedBroken =  function(body, cb) {
		var Child = server.models.Child;

		Parent.create(body, function(err, parent) {
			if (!body.children) {
				return cb(Error('We actually trying to create children along with the parent here ;)'));
			}
			
			body.children.forEach(function(child) {
				var tmp = parent.children.build(child);
				console.log('Is the parent ID set on the child?', tmp)
			});

			parent.save(function (err, children) {
				Parent.find({
					where: {
						parentId: parent.parentId
					},
					include: 'children'
				}, cb);
			});
		})
	}

	loopback.remoteMethod(
		Parent.advancedBroken, {
			accepts: [{
				arg: 'body',
				type: 'object',
				required: true,
				'http': {
					source: 'body'
				}
			}],
			returns: {
				arg: 'result',
				type: 'object',
				root: true
			},
			http: {
				path: '/advancedBroken',
				verb: 'post'
			},
			description: 'The more advanced aproach: use build() to create children and save parent. This does NOT work, as the children do not get saved.'
		}
	);

	Parent.advancedDucktaped =  function(body, cb) {
		var Child = server.models.Child;

		Parent.create(body, function(err, parent) {
			if (!body.children) {
				return cb(Error('We actually trying to create children along with the parent here ;)'));
			}

			var children = body.children.map(function(child) {
				return parent.children.build(child);
			});

			Child.create(children, function (err, children) {
				Parent.find({
					where: {
						parentId: parent.parentId
					},
					include: 'children'
				}, cb);
			});
		})
	}

	loopback.remoteMethod(
		Parent.advancedDucktaped, {
			accepts: [{
				arg: 'body',
				type: 'object',
				required: true,
				'http': {
					source: 'body'
				}
			}],
			returns: {
				arg: 'result',
				type: 'object',
				root: true
			},
			http: {
				path: '/advancedDucktaped',
				verb: 'post'
			},
			description: 'Using build() to create children and call Child.create() save just one line of code compared to the simple approach. This cant be it either.'
		}
	);

};

/*
{
  "name": "parent1",
  "children": [{
    "name": "child1"
  }, {
    "name": "child2"
  }]
}
 */
