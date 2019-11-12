"use strict";var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports, "__esModule", { value: true });exports.traverseThenProcessWithLogicalOperator = exports.traverseThenProcess = exports.processThenTraverse = exports.handleMiddlewareNextCall = void 0;var _assert = _interopRequireDefault(require("assert"));



const handleMiddlewareNextCall = ({ dataProcessCallback, targetFunction, aggregator }) => {
  return new Proxy(targetFunction, {
    async apply(target, thisArg, argArray) {
      let { nodeInstance, traversalDepth, eventEmitter } = argArray[0];
      let nextCalled = false;

      const nextFunction = async () => {
        nextCalled = true;
        let traversalResultIterator = await Reflect.apply(...arguments);
        for await (let traversalResult of traversalResultIterator) aggregator.merge(traversalResult.result);
      };

      let result = await dataProcessCallback({ nextProcessData: aggregator.value, additionalParameter: { nextFunction } });
      if (!nextCalled) await nextFunction();

      return traversalDepth == 0 ? aggregator.value : aggregator;
    } });

};exports.handleMiddlewareNextCall = handleMiddlewareNextCall;


const processThenTraverse = ({ dataProcessCallback, targetFunction, aggregator }) => {
  return new Proxy(targetFunction, {
    async apply(target, thisArg, argArray) {
      let { nodeInstance, traversalDepth, eventEmitter } = argArray[0];
      eventEmitter.on('nodeTraversalCompleted', data => {

      });

      let result = await dataProcessCallback({ nextProcessData: aggregator.value, additionalParameter: {} });

      let traversalResultIterator = await Reflect.apply(...arguments);
      for await (let traversalResult of traversalResultIterator) aggregator.merge(traversalResult.result);

      return traversalDepth == 0 ? aggregator.value : aggregator;
    } });

};exports.processThenTraverse = processThenTraverse;


const traverseThenProcess = ({ dataProcessCallback, targetFunction, aggregator }) => {
  return new Proxy(targetFunction, {
    async apply(target, thisArg, argArray) {
      let { nodeInstance, traversalDepth, eventEmitter } = argArray[0];
      eventEmitter.on('nodeTraversalCompleted', data => {

      });

      let traversalResultIterator = await Reflect.apply(...arguments);
      for await (let traversalResult of traversalResultIterator) aggregator.merge(traversalResult.result);

      let result = await dataProcessCallback({ nextProcessData: aggregator.value, additionalParameter: {} });

      return traversalDepth == 0 ? aggregator.value : aggregator;
    } });

};exports.traverseThenProcess = traverseThenProcess;


const traverseThenProcessWithLogicalOperator = ({ dataProcessCallback, targetFunction, aggregator }) => {
  return new Proxy(targetFunction, {
    async apply(target, thisArg, argArray) {
      let { nodeInstance, traversalDepth, eventEmitter } = argArray[0];
      eventEmitter.on('nodeTraversalCompleted', data => {

      });

      let traversalResultIterator = await Reflect.apply(...arguments);
      for await (let traversalResult of traversalResultIterator) {
        let relatedPort = traversalResult.config.port;
        (0, _assert.default)(relatedPort.properties.logicalOperator, `• port (key="${relatedPort.properties.key}") must have "logicalOperator" property assigned, to aggregate results.`);

        let logicalOperator = relatedPort.properties.logicalOperator;
        aggregator.merge(traversalResult.result, undefined, logicalOperator);
      }

      let result = await dataProcessCallback({ nextProcessData: aggregator.calculatedLogicalOperaion, additionalParameter: {} });

      return traversalDepth == 0 ? [result] : aggregator;
    } });

};exports.traverseThenProcessWithLogicalOperator = traverseThenProcessWithLogicalOperator;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NvdXJjZS90cmF2ZXJzYWxJbXBsZW1lbnRhdGlvbi90cmF2ZXJzYWxJbnRlcmNlcHRpb24uanMiXSwibmFtZXMiOlsiaGFuZGxlTWlkZGxld2FyZU5leHRDYWxsIiwiZGF0YVByb2Nlc3NDYWxsYmFjayIsInRhcmdldEZ1bmN0aW9uIiwiYWdncmVnYXRvciIsIlByb3h5IiwiYXBwbHkiLCJ0YXJnZXQiLCJ0aGlzQXJnIiwiYXJnQXJyYXkiLCJub2RlSW5zdGFuY2UiLCJ0cmF2ZXJzYWxEZXB0aCIsImV2ZW50RW1pdHRlciIsIm5leHRDYWxsZWQiLCJuZXh0RnVuY3Rpb24iLCJ0cmF2ZXJzYWxSZXN1bHRJdGVyYXRvciIsIlJlZmxlY3QiLCJhcmd1bWVudHMiLCJ0cmF2ZXJzYWxSZXN1bHQiLCJtZXJnZSIsInJlc3VsdCIsIm5leHRQcm9jZXNzRGF0YSIsInZhbHVlIiwiYWRkaXRpb25hbFBhcmFtZXRlciIsInByb2Nlc3NUaGVuVHJhdmVyc2UiLCJvbiIsImRhdGEiLCJ0cmF2ZXJzZVRoZW5Qcm9jZXNzIiwidHJhdmVyc2VUaGVuUHJvY2Vzc1dpdGhMb2dpY2FsT3BlcmF0b3IiLCJyZWxhdGVkUG9ydCIsImNvbmZpZyIsInBvcnQiLCJwcm9wZXJ0aWVzIiwibG9naWNhbE9wZXJhdG9yIiwia2V5IiwidW5kZWZpbmVkIiwiY2FsY3VsYXRlZExvZ2ljYWxPcGVyYWlvbiJdLCJtYXBwaW5ncyI6InVUQUFBOzs7O0FBSU8sTUFBTUEsd0JBQXdCLEdBQUcsQ0FBQyxFQUFFQyxtQkFBRixFQUF1QkMsY0FBdkIsRUFBdUNDLFVBQXZDLEVBQUQsS0FBeUQ7QUFDL0YsU0FBTyxJQUFJQyxLQUFKLENBQVVGLGNBQVYsRUFBMEI7QUFDL0IsVUFBTUcsS0FBTixDQUFZQyxNQUFaLEVBQW9CQyxPQUFwQixFQUE2QkMsUUFBN0IsRUFBdUM7QUFDckMsVUFBSSxFQUFFQyxZQUFGLEVBQWdCQyxjQUFoQixFQUFnQ0MsWUFBaEMsS0FBaURILFFBQVEsQ0FBQyxD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QVUsQ0FBQ2dDLHlCQUE5QixFQUF5RGIsbUJBQW1CLEVBQUUsRUFBOUUsRUFBRCxDQUF0Qzs7QUFFQSxhQUFPWixjQUFjLElBQUksQ0FBbEIsR0FBc0IsQ0FBQ1MsTUFBRCxDQUF0QixHQUFpQ2hCLFVBQXhDO0FBQ0QsS0FuQjhCLEVBQTFCLENBQVA7O0FBcUJELENBdEJNLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXNzZXJ0IGZyb20gJ2Fzc2VydCdcblxuLy8gdmlzaXRpbmcgZWFjaCBub2RlIGJlZm9yZSB2aXNpdGluZyBpdCdzIGNoaWxkIG5vZGVzLlxuLy8gVGhlIG1pZGRsZXdhcmVzIHRoYXQgZm9sbG93IHRoZSBLb2Egc3BlY2lmaWNhdGlvbiB1c2UgbmV4dCB0byBjYWxsIG9uZSBhbm90aGVyLiBJbiB0aGlzIGNhc2UgdGhlIG5leHRGdW5jdGlvbiB3aWxsIGJlIHVzZWQgaW5zdGVhZCwgaW4gd2hpY2ggaXQgY29udHJvbGxzIHRoZSBwcm9wYWdhdGlvbiBvZiBuZXN0ZWQgdHJhdmVyc2FsIG5vZGVzLlxuZXhwb3J0IGNvbnN0IGhhbmRsZU1pZGRsZXdhcmVOZXh0Q2FsbCA9ICh7IGRhdGFQcm9jZXNzQ2FsbGJhY2ssIHRhcmdldEZ1bmN0aW9uLCBhZ2dyZWdhdG9yIH0pID0+IHtcbiAgcmV0dXJuIG5ldyBQcm94eSh0YXJnZXRGdW5jdGlvbiwge1xuICAgIGFzeW5jIGFwcGx5KHRhcmdldCwgdGhpc0FyZywgYXJnQXJyYXkpIHtcbiAgICAgIGxldCB7IG5vZGVJbnN0YW5jZSwgdHJhdmVyc2FsRGVwdGgsIGV2ZW50RW1pdHRlciB9ID0gYXJnQXJyYXlbMF1cbiAgICAgIGxldCBuZXh0Q2FsbGVkID0gZmFsc2VcbiAgICAgIC8vIEEgbmV4dCBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgdXNlZCB0byBjb21wb3NlIGluIGEgc2Vuc2UgdGhlIG1pZGRsZXdhcmVzIHRoYXQgYXJlIGJlaW5nIGV4ZWN1dGVkIGR1cmluZyB0cmF2ZXJzYWwuIEFzIG1pZGRsZXdhcmVzIHJlbGllcyBvbiBgbmV4dGAgZnVuY3Rpb24gdG8gY2hhaW4gdGhlIGV2ZW50cy5cbiAgICAgIGNvbnN0IG5leHRGdW5jdGlvbiA9IGFzeW5jICgpID0+IHtcbiAgICAgICAgbmV4dENhbGxlZCA9IHRydWVcbiAgICAgICAgbGV0IHRyYXZlcnNhbFJlc3VsdEl0ZXJhdG9yID0gYXdhaXQgUmVmbGVjdC5hcHBseSguLi5hcmd1bWVudHMpXG4gICAgICAgIGZvciBhd2FpdCAobGV0IHRyYXZlcnNhbFJlc3VsdCBvZiB0cmF2ZXJzYWxSZXN1bHRJdGVyYXRvcikgYWdncmVnYXRvci5tZXJnZSh0cmF2ZXJzYWxSZXN1bHQucmVzdWx0KVxuICAgICAgfVxuXG4gICAgICBsZXQgcmVzdWx0ID0gYXdhaXQgZGF0YVByb2Nlc3NDYWxsYmFjayh7IG5leHRQcm9jZXNzRGF0YTogYWdncmVnYXRvci52YWx1ZSwgYWRkaXRpb25hbFBhcmFtZXRlcjogeyBuZXh0RnVuY3Rpb24gfSB9KVxuICAgICAgaWYgKCFuZXh0Q2FsbGVkKSBhd2FpdCBuZXh0RnVuY3Rpb24oKSAvLyBpbiBzb21lIGNhc2VzIHRoZSBkYXRhIHByb2Nlc3MgcmV0dXJucyB3aXRob3V0IGNhbGxpbmcgbmV4dEZ1bmN0aW9uICh3aGVuIGl0IGlzIGEgcmVndWxhciBub2RlLCBub3QgYSBwcm9jZXNzIGludGVuZGluZyB0byBleGVjdXRlIGEgbWlkZGxld2FyZSkuXG5cbiAgICAgIHJldHVybiB0cmF2ZXJzYWxEZXB0aCA9PSAwID8gYWdncmVnYXRvci52YWx1ZSA6IGFnZ3JlZ2F0b3IgLy8gY2hlY2sgaWYgdG9wIGxldmVsIGNhbGwgYW5kIG5vdCBhbiBpbml0aWF0ZWQgbmVzdGVkIHJlY3Vyc2l2ZSBjYWxsLlxuICAgIH0sXG4gIH0pXG59XG5cbi8vIHZpc2l0aW5nIGVhY2ggbm9kZSBiZWZvcmUgdmlzaXRpbmcgaXQncyBjaGlsZCBub2Rlcy5cbmV4cG9ydCBjb25zdCBwcm9jZXNzVGhlblRyYXZlcnNlID0gKHsgZGF0YVByb2Nlc3NDYWxsYmFjaywgdGFyZ2V0RnVuY3Rpb24sIGFnZ3JlZ2F0b3IgfSkgPT4ge1xuICByZXR1cm4gbmV3IFByb3h5KHRhcmdldEZ1bmN0aW9uLCB7XG4gICAgYXN5bmMgYXBwbHkodGFyZ2V0LCB0aGlzQXJnLCBhcmdBcnJheSkge1xuICAgICAgbGV0IHsgbm9kZUluc3RhbmNlLCB0cmF2ZXJzYWxEZXB0aCwgZXZlbnRFbWl0dGVyIH0gPSBhcmdBcnJheVswXVxuICAgICAgZXZlbnRFbWl0dGVyLm9uKCdub2RlVHJhdmVyc2FsQ29tcGxldGVkJywgZGF0YSA9PiB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGRhdGEudmFsdWUsICcgcmVzb2x2ZWQuJylcbiAgICAgIH0pXG5cbiAgICAgIGxldCByZXN1bHQgPSBhd2FpdCBkYXRhUHJvY2Vzc0NhbGxiYWNrKHsgbmV4dFByb2Nlc3NEYXRhOiBhZ2dyZWdhdG9yLnZhbHVlLCBhZGRpdGlvbmFsUGFyYW1ldGVyOiB7fSB9KVxuXG4gICAgICBsZXQgdHJhdmVyc2FsUmVzdWx0SXRlcmF0b3IgPSBhd2FpdCBSZWZsZWN0LmFwcGx5KC4uLmFyZ3VtZW50cylcbiAgICAgIGZvciBhd2FpdCAobGV0IHRyYXZlcnNhbFJlc3VsdCBvZiB0cmF2ZXJzYWxSZXN1bHRJdGVyYXRvcikgYWdncmVnYXRvci5tZXJnZSh0cmF2ZXJzYWxSZXN1bHQucmVzdWx0KVxuXG4gICAgICByZXR1cm4gdHJhdmVyc2FsRGVwdGggPT0gMCA/IGFnZ3JlZ2F0b3IudmFsdWUgOiBhZ2dyZWdhdG9yIC8vIGNoZWNrIGlmIHRvcCBsZXZlbCBjYWxsIGFuZCBub3QgYW4gaW5pdGlhdGVkIG5lc3RlZCByZWN1cnNpdmUgY2FsbC5cbiAgICB9LFxuICB9KVxufVxuXG4vLyB2aXNpbmcgdGhlIG5vZGUgYWZ0ZXIgdmlzaXRpbmcgdGhlIGNoaWxkIG5vZGVzLlxuZXhwb3J0IGNvbnN0IHRyYXZlcnNlVGhlblByb2Nlc3MgPSAoeyBkYXRhUHJvY2Vzc0NhbGxiYWNrLCB0YXJnZXRGdW5jdGlvbiwgYWdncmVnYXRvciB9KSA9PiB7XG4gIHJldHVybiBuZXcgUHJveHkodGFyZ2V0RnVuY3Rpb24sIHtcbiAgICBhc3luYyBhcHBseSh0YXJnZXQsIHRoaXNBcmcsIGFyZ0FycmF5KSB7XG4gICAgICBsZXQgeyBub2RlSW5zdGFuY2UsIHRyYXZlcnNhbERlcHRoLCBldmVudEVtaXR0ZXIgfSA9IGFyZ0FycmF5WzBdXG4gICAgICBldmVudEVtaXR0ZXIub24oJ25vZGVUcmF2ZXJzYWxDb21wbGV0ZWQnLCBkYXRhID0+IHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coZGF0YS52YWx1ZSwgJyByZXNvbHZlZC4nKVxuICAgICAgfSlcblxuICAgICAgbGV0IHRyYXZlcnNhbFJlc3VsdEl0ZXJhdG9yID0gYXdhaXQgUmVmbGVjdC5hcHBseSguLi5hcmd1bWVudHMpXG4gICAgICBmb3IgYXdhaXQgKGxldCB0cmF2ZXJzYWxSZXN1bHQgb2YgdHJhdmVyc2FsUmVzdWx0SXRlcmF0b3IpIGFnZ3JlZ2F0b3IubWVyZ2UodHJhdmVyc2FsUmVzdWx0LnJlc3VsdClcblxuICAgICAgbGV0IHJlc3VsdCA9IGF3YWl0IGRhdGFQcm9jZXNzQ2FsbGJhY2soeyBuZXh0UHJvY2Vzc0RhdGE6IGFnZ3JlZ2F0b3IudmFsdWUsIGFkZGl0aW9uYWxQYXJhbWV0ZXI6IHt9IH0pXG5cbiAgICAgIHJldHVybiB0cmF2ZXJzYWxEZXB0aCA9PSAwID8gYWdncmVnYXRvci52YWx1ZSA6IGFnZ3JlZ2F0b3IgLy8gY2hlY2sgaWYgdG9wIGxldmVsIGNhbGwgYW5kIG5vdCBhbiBpbml0aWF0ZWQgbmVzdGVkIHJlY3Vyc2l2ZSBjYWxsLlxuICAgIH0sXG4gIH0pXG59XG5cbi8vIHJldHVybnMgdGhlIHByb2Nlc3MgcmVzdWx0IG9mIHRoZSByb290IG5vZGUsIHdoaWxlIHJldHVybm5pbmcgdGhlIGFnZ3JlZ2F0b3IgZm9yIGFueSBuZXN0ZWQgbm9kZXMgdGhhdCB3aWxsIGV2ZW50dWFsbHkgYmUgbWVyZ2VkIHRvZ2V0aGVyIHRocm91Z2ggdGhlIEFnZ3JlZ2F0b3IgaW1wbGVtZW50YXRpb24uIFVzZWQgZm9yIENPTkZJR1VSRSByZWxhdGlvbnNoaXAgd2l0aCBjYXNlIHN3aXRjaGVzLlxuZXhwb3J0IGNvbnN0IHRyYXZlcnNlVGhlblByb2Nlc3NXaXRoTG9naWNhbE9wZXJhdG9yID0gKHsgZGF0YVByb2Nlc3NDYWxsYmFjaywgdGFyZ2V0RnVuY3Rpb24sIGFnZ3JlZ2F0b3IgfSkgPT4ge1xuICByZXR1cm4gbmV3IFByb3h5KHRhcmdldEZ1bmN0aW9uLCB7XG4gICAgYXN5bmMgYXBwbHkodGFyZ2V0LCB0aGlzQXJnLCBhcmdBcnJheSkge1xuICAgICAgbGV0IHsgbm9kZUluc3RhbmNlLCB0cmF2ZXJzYWxEZXB0aCwgZXZlbnRFbWl0dGVyIH0gPSBhcmdBcnJheVswXVxuICAgICAgZXZlbnRFbWl0dGVyLm9uKCdub2RlVHJhdmVyc2FsQ29tcGxldGVkJywgZGF0YSA9PiB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGRhdGEudmFsdWUsICcgcmVzb2x2ZWQuJylcbiAgICAgIH0pXG5cbiAgICAgIGxldCB0cmF2ZXJzYWxSZXN1bHRJdGVyYXRvciA9IGF3YWl0IFJlZmxlY3QuYXBwbHkoLi4uYXJndW1lbnRzKVxuICAgICAgZm9yIGF3YWl0IChsZXQgdHJhdmVyc2FsUmVzdWx0IG9mIHRyYXZlcnNhbFJlc3VsdEl0ZXJhdG9yKSB7XG4gICAgICAgIGxldCByZWxhdGVkUG9ydCA9IHRyYXZlcnNhbFJlc3VsdC5jb25maWcucG9ydFxuICAgICAgICBhc3NlcnQocmVsYXRlZFBvcnQucHJvcGVydGllcy5sb2dpY2FsT3BlcmF0b3IsIGDigKIgcG9ydCAoa2V5PVwiJHtyZWxhdGVkUG9ydC5wcm9wZXJ0aWVzLmtleX1cIikgbXVzdCBoYXZlIFwibG9naWNhbE9wZXJhdG9yXCIgcHJvcGVydHkgYXNzaWduZWQsIHRvIGFnZ3JlZ2F0ZSByZXN1bHRzLmApXG4gICAgICAgIC8vIGNvbmRpdGlvbmFsIGNvbXBhcmlzb24gdHlwZSB0byB1c2UgZm9yIHJlc29sdmluZyBib29sZWFuIHJlc3VsdHMuXG4gICAgICAgIGxldCBsb2dpY2FsT3BlcmF0b3IgPSByZWxhdGVkUG9ydC5wcm9wZXJ0aWVzLmxvZ2ljYWxPcGVyYXRvclxuICAgICAgICBhZ2dyZWdhdG9yLm1lcmdlKHRyYXZlcnNhbFJlc3VsdC5yZXN1bHQsIHVuZGVmaW5lZCwgbG9naWNhbE9wZXJhdG9yKVxuICAgICAgfVxuXG4gICAgICBsZXQgcmVzdWx0ID0gYXdhaXQgZGF0YVByb2Nlc3NDYWxsYmFjayh7IG5leHRQcm9jZXNzRGF0YTogYWdncmVnYXRvci5jYWxjdWxhdGVkTG9naWNhbE9wZXJhaW9uLCBhZGRpdGlvbmFsUGFyYW1ldGVyOiB7fSB9KVxuXG4gICAgICByZXR1cm4gdHJhdmVyc2FsRGVwdGggPT0gMCA/IFtyZXN1bHRdIDogYWdncmVnYXRvciAvLyBjaGVjayBpZiB0b3AgbGV2ZWwgY2FsbCBhbmQgbm90IGFuIGluaXRpYXRlZCBuZXN0ZWQgcmVjdXJzaXZlIGNhbGwuXG4gICAgfSxcbiAgfSlcbn1cblxuLy8gZXhwb3J0IGNvbnN0IHRyYXZlcnNlVGhlblByb2Nlc3NGb3JTd2l0Y2ggPSAoeyBkYXRhUHJvY2Vzc0NhbGxiYWNrLCB0YXJnZXRGdW5jdGlvbiwgYWdncmVnYXRvciB9KSA9PiB7XG4vLyAgIHJldHVybiBuZXcgUHJveHkodGFyZ2V0RnVuY3Rpb24sIHtcbi8vICAgICBhc3luYyBhcHBseSh0YXJnZXQsIHRoaXNBcmcsIGFyZ0FycmF5KSB7XG4vLyAgICAgICBsZXQgeyBub2RlSW5zdGFuY2UsIHRyYXZlcnNhbERlcHRoLCBldmVudEVtaXR0ZXIgfSA9IGFyZ0FycmF5WzBdXG5cbi8vICAgICAgIGxldCB0cmF2ZXJzYWxSZXN1bHRJdGVyYXRvciA9IGF3YWl0IFJlZmxlY3QuYXBwbHkoLi4uYXJndW1lbnRzKVxuLy8gICAgICAgZm9yIGF3YWl0IChsZXQgdHJhdmVyc2FsUmVzdWx0IG9mIHRyYXZlcnNhbFJlc3VsdEl0ZXJhdG9yKSBhZ2dyZWdhdG9yLm1lcmdlKHRyYXZlcnNhbFJlc3VsdC5yZXN1bHQpXG5cbi8vICAgICAgIGxldCByZXN1bHQgPSBhd2FpdCBkYXRhUHJvY2Vzc0NhbGxiYWNrKHsgbmV4dFByb2Nlc3NEYXRhOiBhZ2dyZWdhdG9yLnZhbHVlLCBhZGRpdGlvbmFsUGFyYW1ldGVyOiB7fSB9KVxuXG4vLyAgICAgICByZXR1cm4gdHJhdmVyc2FsRGVwdGggPT0gMCA/IGFnZ3JlZ2F0b3IudmFsdWUgOiBhZ2dyZWdhdG9yIC8vIGNoZWNrIGlmIHRvcCBsZXZlbCBjYWxsIGFuZCBub3QgYW4gaW5pdGlhdGVkIG5lc3RlZCByZWN1cnNpdmUgY2FsbC5cbi8vICAgICB9LFxuLy8gICB9KVxuLy8gfVxuIl19