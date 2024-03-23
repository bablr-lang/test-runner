/* global console, URL, globalThis */

import indent from 'indent-string';
import map from 'iter-tools-es/methods/map';
import { evaluate as agastEvaluate, Context as AgastContext } from '@bablr/agast-vm';
import { evaluate, Context, Source } from '@bablr/bablr-vm';
import { runSync } from '@bablr/agast-vm-helpers/run';
import { buildDependentLanguages } from '@bablr/helpers/grammar';
import { printPrettyCSTML } from '@bablr/agast-helpers/stream';
import { enhanceWithDebugLogging as log } from '@bablr/language_enhancer-debug-log';
import { enhanceStrategyWithDebugLogging as logStrategy } from '@bablr/strategy_enhancer-debug-log';
import { createParseStrategy } from '@bablr/bablr-vm-strategy-parse';

Error.stackTraceLimit = 20;

export const runTests = (language, allTestCases) => {
  let testCases = allTestCases;

  const onlyCases = testCases.filter((case_) => case_.only);

  if (onlyCases.length) {
    testCases = onlyCases;
  }

  for (const { matcher, sourceText, parsed, skip } of testCases) {
    const skipped = skip ? ' (skipped)' : '';
    console.log(`Input: \`${sourceText.replace(/[`\\]/g, '\\$&')}\`${skipped}`);

    if (!skip) {
      const agastCtx = AgastContext.create();
      const ctx = Context.from(
        agastCtx.facade,
        new Map(
          map(
            ({ 0: url, 1: language }) => ({ 0: url, 1: log(language, '    ') }),
            buildDependentLanguages(language),
          ),
        ),
      );
      const source = Source.from(sourceText);

      const terminals = runSync(
        agastEvaluate(
          agastCtx,
          logStrategy(evaluate(ctx, source, createParseStrategy(matcher, {})), '  '),
        ),
      );

      const printed = printPrettyCSTML(terminals);

      if (printed !== parsed) {
        throw new Error(
          `Assertion failure\n  Expected:\n${indent(parsed, 4)}\n  Received:\n${indent(
            printed,
            4,
          )}\n`,
        );
      }
    }
    console.log();
  }
};
