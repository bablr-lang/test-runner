## @bablr/test-runner

A simple test runner for BABLR languages.

### Example usage

```js
import { runTests } from '@bablr/test-runner';
import { spam } from '@bablr/boot';
import { dedent } from '@qnighy/dedent';
import * as JSON from '@bablr/language-json';

const testCases = [
  {
    only: false,
    skip: false,
    matcher: spam`<Expression>`,
    sourceText: '"hello"',
    parsed: dedent`\
      <>
        children[]:
        <String>
          open:
          <Punctuator balanced='"' lexicalSpan='String'>
            '"'
          </>
          content:
          <StringContent>
            'hello'
          </>
          close:
          <Punctuator balancer>
            '"'
          </>
        </>
      </>`,
  },
];

runTests(JSON, testCases);
```
