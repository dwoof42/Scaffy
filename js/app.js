angular.module('app', [])
    .controller('ScaffoldController', function () {

        var vm = this;
        vm.sourceText = "public class FooBar\n {\npublic int MyId {get;set;}\npublic DateTime? SomeDate {get;set;}";
        vm.model = '';
        vm.className = '';
        

        vm.onChange = function () {
            readClass(vm.sourceText) ;
            readMatches();
        };

        function readClass(text) {
            var re = /public\s*class\s*([a-zA-Z0-9]+)/;
            var match = re.exec(vm.sourceText);
            vm.className = match ? match[1] : 'Unknown';
        }

        function readMatches () {
            var re = /public ([0-9a-zA-Z]+)(\??)\s*(\S*)/g;

            var matches = [];
            var currrent, 
                text = vm.sourceText;

            while((current = re.exec(text)) != null) {
                matches.push(current);
            }
            vm.work = matches;
            makeModel(matches);
            makeResource(matches);

        }

        function makeModel (matches) {
            var items = matches.map(function (m) {
                return camel(m[3]) + m[2] + ': ' + getType(m[1]) + ';';
            }).join('\n');
            vm.model = items;
        }

        function makeResource (matches) {
            var s = 'interface ' + vm.className + ' extends ng.resource.IResource<' + vm.className + "> {\n";
            s += vm.model;
            s += '\n}\n';
            s += 'interface ' + vm.className + 'Resource extends ng.resource.IResourceClass<' + vm.className + "> {\n";
            s += "}\n\n";
            vm.resource = s;

        }

        function getType (netType) {

            switch(netType) {
                case 'int':
                case 'Int32':
                    return 'number';
                case 'bool':
                case 'Boolean':
                    return 'boolean';
                case 'DateTime':
                    return 'date';
                default:
                    return 'any';
            }

        }

        function camel (word) {
            return word[0].toLowerCase() + word.substring(1);
        }

        vm.onChange(vm.sourceText);

    });
