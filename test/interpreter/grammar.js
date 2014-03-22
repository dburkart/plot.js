var should = require('should');
var grammar = require('../../lib/interpreter/grammar');
var token = require('../../lib/interpreter/token');
var Lexer = require('../../lib/interpreter/lexer');

var getTokens = function(string) {
    var lexer = new Lexer(string);
    var tokens = [];

    var tok = lexer.next();
    while (tok.type !== token.type.nil) {
        tokens.push(tok);
        tok = lexer.next();
    }

    return tokens;
}

// var tokens = getTokens('f()');
// var program = grammar.classify(tokens);

// console.log(program.tokens);

describe('[grammar.type.var_list]', function() {
    it("'a, b, c' is a valid var_list", function() {
        var tokens = getTokens('a, b, c');
        grammar.var_list(tokens).should.be.ok;
    });
    it("'1, 2, 3' is a valid var_list", function() {
        var tokens = getTokens('1, 2, 3');
        grammar.var_list(tokens).should.be.ok;
    });
    it("'a, 1, c' is a valid var_list", function() {
        var tokens = getTokens('a, 1, c');
        grammar.var_list(tokens).should.be.ok;
    });
    it("'a, b, c * 4' is not a valid var_list", function() {
        var tokens = getTokens('a, b, c * 4');
        grammar.var_list(tokens).tokens.should.containDeep([ { type: 3, value: 'a' },
             { type: 4, value: ',' },
             { type: 3, value: 'b' },
             { type: 4, value: ',' },
             { type: 3, value: 'c' } ]);
    });
     it("'a' is not a valid var_list", function() {
        var tokens = getTokens('a');
        grammar.var_list(tokens).should.be.ok;
    });
});

describe('[grammar.type.statement]', function() {
    it("'b * 3' is a valid statement", function() {
        var tokens = getTokens('b * 3');
        grammar.statement(tokens).should.be.ok;
    });
    it("'b * 3 + 2' is a valid statement", function() {
        var tokens = getTokens('b * 3 + 2');
        grammar.statement(tokens).should.be.ok;
    });
    it("'b = 4 * 3' is a valid statement", function() {
        var tokens = getTokens('b = 4 * 3');
        grammar.statement(tokens).should.be.ok;
    });
    it("'3, 4, 5 * 7' is a valid statement", function() {
        var tokens = getTokens('3, 4, 5 * 7');
        grammar.statement(tokens).should.be.ok;
    });
    it("'3 4' is not a valid statement", function() {
        var tokens = getTokens('3 4');
        grammar.statement(tokens).tokens.should.containDeep([ { type: 2, value: 3 } ]);
    });
    it("'f(x)' is a valid statement", function() {
        var tokens = getTokens('f(x)');
        grammar.statement(tokens).should.be.ok;
    });
    it("'f(x) + 3' is a valid statement", function() {
        var tokens = getTokens('f(x) + 3');
        grammar.statement(tokens).should.be.ok;
    });
    it("'y = f(x) + 3' is a valid statement", function() {
        var tokens = getTokens('y = f(x) + 3');
        grammar.statement(tokens).should.be.ok;
    });
    it("'(2 + 3) * 5' is a valid statement", function() {
        var tokens = getTokens('(2 + 3) * 5');
        grammar.statement(tokens).should.be.ok;
    });
});

describe('[grammar.type.statement_list]', function() {
    it("'b * 3' is a valid statement_list", function() {
        var tokens = getTokens('b * 3');
        grammar.statement_list(tokens).should.be.ok;
        grammar.statement_list(tokens).tokens.length.should.be.eql(1);
    });
    it("'b * 3, 4, 5' is a valid statement_list", function() {
        var tokens = getTokens('b * 3, 4 ,5');
        grammar.statement_list(tokens).should.be.ok;
        grammar.statement_list(tokens).tokens.length.should.be.eql(3);
    });
});

describe('[grammar.type.function_def]', function() {
    it("'f(x) = 2 * x' is a valid function_def", function() {
        var tokens = getTokens('f(x) = 2 * x');
        grammar.function_def(tokens).should.be.ok;
    });
    it("'f(x) = 2 * x\n3 + 4' is not a valid function_def", function() {
        var tokens = getTokens('f(x) = 2 * x\n3 + 4');
        grammar.function_def(tokens).definition.tokens.should.containDeep([ { type: 2, value: 2 },
        { type: 4, value: '*' },
        { type: 3, value: 'x' } ]);
        grammar.function_def(tokens).reference_pos.should.be.eql(8);
        grammar.function_def(tokens).definition.reference_pos.should.be.eql(3);
    });
    it("'f(x + 5) = 2 * x' is not a valid function_def", function() {
        var tokens = getTokens('f(x + 5) = 2 * x');
        grammar.function_def(tokens).should.not.be.ok;
    });
    it("'f(x) = 2 * x, x = 3 + x' is a valid function_def", function() {
        var tokens = getTokens('f(x) = 2 * x, x = 3 + x');
        grammar.function_def(tokens).definition.tokens.should.containDeep([ { type: 2, value: 2 },
        { type: 4, value: '*' },
        { type: 3, value: 'x' },
        { type: 4, value: ',' },
        { type: 3, value: 'x' },
        { type: 5, value: '=' },
        { type: 2, value: '3' },
        { type: 4, value: '+' },
        { type: 3, value: 'x' }, ]);
    });
    it("'f(x) = 2 * x,\nx = 3 + x' is a valid function_def", function() {
        var tokens = getTokens('f(x) = 2 * x,\nx = 3 + x');
        grammar.function_def(tokens).should.be.ok;
    });
    it("'2 * x' is not a valid function_def", function() {
        var tokens = getTokens('2 * x');
        grammar.function_def(tokens).should.not.be.ok;
    });
    it("'x * 2' is not a valid function_def", function() {
        var tokens = getTokens('x * 2');
        grammar.function_def(tokens).should.not.be.ok;
    });
});

describe('[grammar.type.function_call]', function() {
    it("'f(x)' is a valid function_call", function() {
        var tokens = getTokens('f(x)');
        grammar.function_call(tokens).should.be.ok;
    });
    it("'f(2 * x)' is a valid function_call", function() {
        var tokens = getTokens('f(2 * x)');
        grammar.function_call(tokens).should.be.ok;
    });
    it("'f(2 * x, 4)' is a valid function_call", function() {
        var tokens = getTokens('f(2 * x, 4)');
        grammar.function_call(tokens).should.be.ok;
    });
    it("'f(x, y, z)' is a valid function_call", function() {
        var tokens = getTokens('f(x, y, z)');
        grammar.function_call(tokens).should.be.ok;
    });
    it("'f(x) = 2 * x' is not a valid function_call", function() {
        var tokens = getTokens('f(x) = 2 * x');
        grammar.function_call(tokens).should.not.be.ok;
    });
    it("'7' is not a valid function_call", function() {
        var tokens = getTokens('7');
        grammar.function_call(tokens).should.not.be.ok;
    });
    it("'g(f(4))' is a valid function_call", function() {
        var tokens = getTokens('g(f(4))');
        grammar.function_call(tokens).should.be.ok;
        grammar.function_call(tokens).tokens.length.should.be.eql(2);
    });
});

describe('[grammar.classify]', function() {
    it("'x + 2'", function() {
        var tokens = getTokens('x + 2');
        grammar.classify(tokens)[0].tokens.should.containDeep([ 
            { type: 3, value: 'x' },
            { type: 4, value: '+' },
            { type: 2, value: 2 } ]);
    });
    it("'f(x) + 2'", function() {
        var tokens = getTokens('f(x) + 2');
        grammar.classify(tokens)[0].tokens.should.containDeep([ { type: 104,
    tokens: 
     [ { type: 3, value: 'f' },
       { type: 101,
         tokens: 
          [ { type: 102,
              tokens: [ { type: 3, value: 'x' } ],
              reference_pos: 2 } ],
         reference_pos: 1 } ],
    reference_pos: 4 },
  { type: 4, value: '+' },
  { type: 2, value: 2 } ]);
    });
    it("'f(x + 2)'", function() {
        var tokens = getTokens('f(x + 2)');
        grammar.classify(tokens)[0].tokens.should.containDeep([ { type: 104,
    tokens: 
     [ { type: 3, value: 'f' },
       { type: 101,
         tokens: 
          [ { type: 102,
              tokens: 
               [ { type: 3, value: 'x' },
                 { type: 4, value: '+' },
                 { type: 2, value: 2 } ],
              reference_pos: 4 } ],
         reference_pos: 3 } ],
    reference_pos: 6 } ]);
    });
    it("'f(x) = 3 * x\nf(4 + 2)'", function() {
        var tokens = getTokens('f(x) = 3 * x\nf(4 + 2)');
        var program = grammar.classify(tokens);

        program.length.should.be.eql(2);
        program[1].tokens.should.containDeep( [ { type: 104,
    tokens: 
     [ { type: 3, value: 'f' },
       { type: 101,
         tokens: 
          [ { type: 102,
              tokens: 
               [ { type: 2, value: 4 },
                 { type: 4, value: '+' },
                 { type: 2, value: 2 } ],
              reference_pos: 4 } ],
         reference_pos: 3 } ],
    reference_pos: 6 } ]);
    });
    it("'(4 + 2) * 6'", function() {
        var tokens = getTokens('(4 + 2) * 6');
        var program = grammar.classify(tokens);

        program.length.should.be.eql(1);
        program[0].tokens.should.containDeep([ { type: 4, value: '(' },
  { type: 2, value: 4 },
  { type: 4, value: '+' },
  { type: 2, value: 2 },
  { type: 4, value: ')' },
  { type: 4, value: '*' },
  { type: 2, value: 6 } ]);
    });

    it("'f() = 4'", function() {
        var tokens = getTokens('f() = 4');
        var program = grammar.classify(tokens);

        program.length.should.be.eql(1);
        program[0].definition.tokens.should.containDeep([ { type: 2, value: 4 } ]);
    });

    it("'f()'", function() {
        var tokens = getTokens('f()');
        var program = grammar.classify(tokens);

        program.length.should.be.eql(1);
        program[0].type.should.be.eql(grammar.type.statement);
        program[0].tokens.should.containDeep([ { type: 104,
    tokens: 
     [ { type: 3, value: 'f' },
       { type: 101,
         tokens: [ { type: 102, tokens: [ 0 ], reference_pos: 0 } ],
         reference_pos: 0 } ],
    reference_pos: 3 } ]);
    });

    it("'f() * f()'", function() {
        var tokens = getTokens('f() * f()');
        var program = grammar.classify(tokens);

        program.length.should.be.eql(1);
        program[0].type.should.be.eql(grammar.type.statement);
        program[0].tokens.should.containDeep([]);
    });

    it("'g(f(4))'", function() {
        var tokens = getTokens('g(f(4))');
        var program = grammar.classify(tokens);

        program.length.should.be.eql(1);
        program[0].type.should.be.eql(grammar.type.statement);
    })

    it("'\n'", function() {
        var tokens = getTokens('\n');
        var program = grammar.classify(tokens);

        program.length.should.be.eql(0);
    })
});