import {asAbsolutePath, asPathTrailComponents} from '../components/utilities/PathUtilities.js';

class RequestUtilities {
    static hasBody(bodyDescriptor) {
        return RequestUtilities.hasNormalizedBody(getNormalizedBodyDescriptor(bodyDescriptor))
    }

    static hasNormalizedBody(normalizedBodyDescriptor) {
        const {shapeId, isRemoved} = normalizedBodyDescriptor
        if (shapeId && !isRemoved) {
            return true
        }
        return false
    }

    static canAddBody(request) {
        const {requestDescriptor} = request
        const {httpMethod, bodyDescriptor} = requestDescriptor
        const hasBody = RequestUtilities.hasBody(bodyDescriptor)
        const httpAllowsBodyForMethod = httpMethod.toLowerCase() !== 'get'
        return !hasBody && httpAllowsBodyForMethod
    }

    static absolutePath(pathId, pathsById) {
        return asAbsolutePath(asPathTrailComponents(pathId, pathsById))
    }

    static requestName(request, pathsById) {
        const {requestDescriptor} = request;
        const {httpMethod, pathComponentId} = requestDescriptor
        return `${httpMethod} ${RequestUtilities.absolutePath(pathComponentId, pathsById)}`
    }
}

export {
    RequestUtilities
}


export function getNormalizedBodyDescriptor(value) {
  if (value && value.ShapedBodyDescriptor) {
    return value.ShapedBodyDescriptor;
  }
  return {};
}
