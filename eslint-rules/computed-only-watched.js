/**
 * Prevents defining single computed variable only to serve as a source
 * for `watch` to uphold shared convention. Suggests watching a getter.
 * Assumes we do not use <script setup> where computed properties can
 * be used in template without exporting them first.
 */
export default {
  meta: {
    type: 'suggestion',
    messages: {
      onlyWatched:
        "'{{name}}' is only used as a watch source; pass a getter to watch() instead.",
    },
  },
  create(context) {
    return {
      VariableDeclarator(node) {
        // definition `const x = computed(...)`
        if (
          node.id.type !== 'Identifier' ||
          node.init?.type !== 'CallExpression' ||
          node.init.callee.name !== 'computed'
        ) {
          return;
        }
        // finds where `x` is read in the script
        const [variable] = context.sourceCode.getDeclaredVariables(node);
        const reads = variable.references.filter((ref) => !ref.init);
        // filter `x` where it is used only once
        if (reads.length !== 1) {
          return;
        }
        // check if `x` is only used as watch source
        const usage = reads[0].identifier;
        const call = usage.parent;
        if (
          call.type === 'CallExpression' &&
          call.callee.name === 'watch' &&
          call.arguments[0] === usage
        ) {
          context.report({
            node: node.id,
            messageId: 'onlyWatched',
            data: { name: variable.name },
          });
        }
      },
    };
  },
};
