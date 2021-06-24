/* tslint:disable */
/* eslint-disable */
/**
 * Starrydata API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 3.0
 * Contact: tomoya.matou@gmail.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import { Configuration } from './configuration';
import globalAxios, { AxiosPromise, AxiosInstance } from 'axios';
// Some imports not used depending on template conditions
// @ts-ignore
import { DUMMY_BASE_URL, assertParamExists, setApiKeyToObject, setBasicAuthToObject, setBearerAuthToObject, setOAuthToObject, setSearchParams, serializeDataIfNeeded, toPathString, createRequestFunction } from './common';
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, RequestArgs, BaseAPI, RequiredError } from './base';

/**
 * 
 * @export
 * @interface Contributor
 */
export interface Contributor {
    /**
     * 
     * @type {string}
     * @memberof Contributor
     */
    family: string;
    /**
     * 
     * @type {string}
     * @memberof Contributor
     */
    given?: string;
}
/**
 * 
 * @export
 * @interface Database
 */
export interface Database {
    /**
     * 
     * @type {string}
     * @memberof Database
     */
    type?: string;
    /**
     * 
     * @type {string}
     * @memberof Database
     */
    id?: string;
    /**
     * 
     * @type {DatabaseAttributes}
     * @memberof Database
     */
    attributes?: DatabaseAttributes;
    /**
     * 
     * @type {DatabaseRelationships}
     * @memberof Database
     */
    relationships?: DatabaseRelationships;
}
/**
 * 
 * @export
 * @interface DatabaseAttributes
 */
export interface DatabaseAttributes {
    /**
     * 
     * @type {string}
     * @memberof DatabaseAttributes
     */
    name?: string;
}
/**
 * 
 * @export
 * @interface DatabaseRelationships
 */
export interface DatabaseRelationships {
    /**
     * 
     * @type {PaperRelationshipsFigures}
     * @memberof DatabaseRelationships
     */
    papers?: PaperRelationshipsFigures;
    /**
     * 
     * @type {PaperRelationshipsFigures}
     * @memberof DatabaseRelationships
     */
    figures?: PaperRelationshipsFigures;
    /**
     * 
     * @type {PaperRelationshipsFigures}
     * @memberof DatabaseRelationships
     */
    samples?: PaperRelationshipsFigures;
}
/**
 * 
 * @export
 * @interface FabricationProcess
 */
export interface FabricationProcess {
    /**
     * 
     * @type {string}
     * @memberof FabricationProcess
     */
    type: string;
    /**
     * 
     * @type {string}
     * @memberof FabricationProcess
     */
    id: string;
    /**
     * 
     * @type {FabricationProcessAttributes}
     * @memberof FabricationProcess
     */
    attributes: FabricationProcessAttributes;
    /**
     * 
     * @type {FabricationProcessRelationships}
     * @memberof FabricationProcess
     */
    relationships?: FabricationProcessRelationships;
}
/**
 * 
 * @export
 * @interface FabricationProcessAttributes
 */
export interface FabricationProcessAttributes {
    /**
     * 
     * @type {string}
     * @memberof FabricationProcessAttributes
     */
    name_ja: string;
}
/**
 * 
 * @export
 * @interface FabricationProcessRelationships
 */
export interface FabricationProcessRelationships {
    /**
     * 
     * @type {FabricationProcessRelationshipsParentId}
     * @memberof FabricationProcessRelationships
     */
    parent_id?: FabricationProcessRelationshipsParentId;
}
/**
 * 
 * @export
 * @interface FabricationProcessRelationshipsParentId
 */
export interface FabricationProcessRelationshipsParentId {
    /**
     * 
     * @type {PaperRelationshipsDatabasesData}
     * @memberof FabricationProcessRelationshipsParentId
     */
    data?: PaperRelationshipsDatabasesData;
}
/**
 * 
 * @export
 * @interface FabricationProcessesData
 */
export interface FabricationProcessesData {
    /**
     * 
     * @type {string}
     * @memberof FabricationProcessesData
     */
    type: string;
    /**
     * 
     * @type {string}
     * @memberof FabricationProcessesData
     */
    id?: string;
    /**
     * 
     * @type {FabricationProcessesDataAttributes}
     * @memberof FabricationProcessesData
     */
    attributes: FabricationProcessesDataAttributes;
}
/**
 * 
 * @export
 * @interface FabricationProcessesDataAttributes
 */
export interface FabricationProcessesDataAttributes {
    /**
     * 
     * @type {string}
     * @memberof FabricationProcessesDataAttributes
     */
    name_ja: string;
    /**
     * 
     * @type {FabricationProcessesDataAttributesParentId}
     * @memberof FabricationProcessesDataAttributes
     */
    parent_id?: FabricationProcessesDataAttributesParentId;
}
/**
 * 
 * @export
 * @interface FabricationProcessesDataAttributesParentId
 */
export interface FabricationProcessesDataAttributesParentId {
    /**
     * 
     * @type {string}
     * @memberof FabricationProcessesDataAttributesParentId
     */
    type: string;
    /**
     * 
     * @type {string}
     * @memberof FabricationProcessesDataAttributesParentId
     */
    id: string;
}
/**
 * 
 * @export
 * @interface InlineObject
 */
export interface InlineObject {
    /**
     * 
     * @type {FabricationProcessesData}
     * @memberof InlineObject
     */
    data: FabricationProcessesData;
}
/**
 * 
 * @export
 * @interface InlineResponse200
 */
export interface InlineResponse200 {
    /**
     * 
     * @type {Array<Paper>}
     * @memberof InlineResponse200
     */
    data?: Array<Paper>;
}
/**
 * 
 * @export
 * @interface InlineResponse2001
 */
export interface InlineResponse2001 {
    /**
     * 
     * @type {InlineResponse2001Data}
     * @memberof InlineResponse2001
     */
    data?: InlineResponse2001Data;
}
/**
 * 
 * @export
 * @interface InlineResponse2001Data
 */
export interface InlineResponse2001Data {
    /**
     * 
     * @type {string}
     * @memberof InlineResponse2001Data
     */
    type?: string;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse2001Data
     */
    id?: string;
    /**
     * 
     * @type {Paper}
     * @memberof InlineResponse2001Data
     */
    attributes?: Paper;
}
/**
 * 
 * @export
 * @interface InlineResponse2002
 */
export interface InlineResponse2002 {
    /**
     * 
     * @type {Array<Database>}
     * @memberof InlineResponse2002
     */
    data?: Array<Database>;
}
/**
 * 
 * @export
 * @interface InlineResponse2003
 */
export interface InlineResponse2003 {
    /**
     * 
     * @type {Array<FabricationProcess>}
     * @memberof InlineResponse2003
     */
    data?: Array<FabricationProcess>;
}
/**
 * 
 * @export
 * @interface Paper
 */
export interface Paper {
    /**
     * 
     * @type {string}
     * @memberof Paper
     */
    type: string;
    /**
     * 
     * @type {number}
     * @memberof Paper
     */
    id: number;
    /**
     * 
     * @type {PaperAttributes}
     * @memberof Paper
     */
    attributes: PaperAttributes;
    /**
     * 
     * @type {PaperRelationships}
     * @memberof Paper
     */
    relationships?: PaperRelationships;
}
/**
 * 
 * @export
 * @interface PaperAttributes
 */
export interface PaperAttributes {
    /**
     * 
     * @type {string}
     * @memberof PaperAttributes
     */
    DOI: string;
    /**
     * 
     * @type {string}
     * @memberof PaperAttributes
     */
    title: string;
    /**
     * 
     * @type {string}
     * @memberof PaperAttributes
     */
    publisher: string;
    /**
     * 
     * @type {Array<Contributor>}
     * @memberof PaperAttributes
     */
    authors: Array<Contributor>;
    /**
     * 
     * @type {string}
     * @memberof PaperAttributes
     */
    container_title: string;
}
/**
 * 
 * @export
 * @interface PaperRelationships
 */
export interface PaperRelationships {
    /**
     * 
     * @type {PaperRelationshipsFigures}
     * @memberof PaperRelationships
     */
    figures?: PaperRelationshipsFigures;
    /**
     * 
     * @type {PaperRelationshipsFigures}
     * @memberof PaperRelationships
     */
    samples?: PaperRelationshipsFigures;
    /**
     * 
     * @type {PaperRelationshipsDatabases}
     * @memberof PaperRelationships
     */
    databases?: PaperRelationshipsDatabases;
}
/**
 * 
 * @export
 * @interface PaperRelationshipsDatabases
 */
export interface PaperRelationshipsDatabases {
    /**
     * 
     * @type {Array<PaperRelationshipsDatabasesData>}
     * @memberof PaperRelationshipsDatabases
     */
    data?: Array<PaperRelationshipsDatabasesData>;
}
/**
 * 
 * @export
 * @interface PaperRelationshipsDatabasesData
 */
export interface PaperRelationshipsDatabasesData {
    /**
     * 
     * @type {string}
     * @memberof PaperRelationshipsDatabasesData
     */
    type?: string;
    /**
     * 
     * @type {string}
     * @memberof PaperRelationshipsDatabasesData
     */
    id?: string;
}
/**
 * 
 * @export
 * @interface PaperRelationshipsFigures
 */
export interface PaperRelationshipsFigures {
    /**
     * 
     * @type {PaperRelationshipsFiguresMeta}
     * @memberof PaperRelationshipsFigures
     */
    meta?: PaperRelationshipsFiguresMeta;
}
/**
 * 
 * @export
 * @interface PaperRelationshipsFiguresMeta
 */
export interface PaperRelationshipsFiguresMeta {
    /**
     * 
     * @type {number}
     * @memberof PaperRelationshipsFiguresMeta
     */
    total?: number;
}

/**
 * DefaultApi - axios parameter creator
 * @export
 */
export const DefaultApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @param {string} fabricationProcessId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteFabricationProcessesFabricationProcessId: async (fabricationProcessId: string, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'fabricationProcessId' is not null or undefined
            assertParamExists('deleteFabricationProcessesFabricationProcessId', 'fabricationProcessId', fabricationProcessId)
            const localVarPath = `/fabrication_processes/{fabrication_process_id}`
                .replace(`{${"fabrication_process_id"}}`, encodeURIComponent(String(fabricationProcessId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'DELETE', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            setSearchParams(localVarUrlObj, localVarQueryParameter, options.query);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 論文一覧取得
         * @summary get databases
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getDatabases: async (options: any = {}): Promise<RequestArgs> => {
            const localVarPath = `/databases`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            setSearchParams(localVarUrlObj, localVarQueryParameter, options.query);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 論文一覧取得
         * @summary get Fabrication Processes
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getFabricationProcesses: async (options: any = {}): Promise<RequestArgs> => {
            const localVarPath = `/fabrication_processes`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            setSearchParams(localVarUrlObj, localVarQueryParameter, options.query);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Get Papers
         * @summary Get Papers
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getPapers: async (options: any = {}): Promise<RequestArgs> => {
            const localVarPath = `/papers`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            setSearchParams(localVarUrlObj, localVarQueryParameter, options.query);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Get Paper
         * @summary get paper
         * @param {string} paperId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getPapersPaperId: async (paperId: string, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'paperId' is not null or undefined
            assertParamExists('getPapersPaperId', 'paperId', paperId)
            const localVarPath = `/papers/{paperId}`
                .replace(`{${"paperId"}}`, encodeURIComponent(String(paperId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            setSearchParams(localVarUrlObj, localVarQueryParameter, options.query);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {InlineObject} [inlineObject] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        postFabricationProcesses: async (inlineObject?: InlineObject, options: any = {}): Promise<RequestArgs> => {
            const localVarPath = `/fabrication_processes`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            localVarHeaderParameter['Content-Type'] = 'application/vnd.api+json';

            setSearchParams(localVarUrlObj, localVarQueryParameter, options.query);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(inlineObject, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * DefaultApi - functional programming interface
 * @export
 */
export const DefaultApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = DefaultApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @param {string} fabricationProcessId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async deleteFabricationProcessesFabricationProcessId(fabricationProcessId: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.deleteFabricationProcessesFabricationProcessId(fabricationProcessId, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 論文一覧取得
         * @summary get databases
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getDatabases(options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<InlineResponse2002>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getDatabases(options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 論文一覧取得
         * @summary get Fabrication Processes
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getFabricationProcesses(options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<InlineResponse2003>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getFabricationProcesses(options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Get Papers
         * @summary Get Papers
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getPapers(options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<InlineResponse200>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getPapers(options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Get Paper
         * @summary get paper
         * @param {string} paperId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getPapersPaperId(paperId: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<InlineResponse2001>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getPapersPaperId(paperId, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @param {InlineObject} [inlineObject] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async postFabricationProcesses(inlineObject?: InlineObject, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.postFabricationProcesses(inlineObject, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * DefaultApi - factory interface
 * @export
 */
export const DefaultApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = DefaultApiFp(configuration)
    return {
        /**
         * 
         * @param {string} fabricationProcessId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteFabricationProcessesFabricationProcessId(fabricationProcessId: string, options?: any): AxiosPromise<void> {
            return localVarFp.deleteFabricationProcessesFabricationProcessId(fabricationProcessId, options).then((request) => request(axios, basePath));
        },
        /**
         * 論文一覧取得
         * @summary get databases
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getDatabases(options?: any): AxiosPromise<InlineResponse2002> {
            return localVarFp.getDatabases(options).then((request) => request(axios, basePath));
        },
        /**
         * 論文一覧取得
         * @summary get Fabrication Processes
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getFabricationProcesses(options?: any): AxiosPromise<InlineResponse2003> {
            return localVarFp.getFabricationProcesses(options).then((request) => request(axios, basePath));
        },
        /**
         * Get Papers
         * @summary Get Papers
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getPapers(options?: any): AxiosPromise<InlineResponse200> {
            return localVarFp.getPapers(options).then((request) => request(axios, basePath));
        },
        /**
         * Get Paper
         * @summary get paper
         * @param {string} paperId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getPapersPaperId(paperId: string, options?: any): AxiosPromise<InlineResponse2001> {
            return localVarFp.getPapersPaperId(paperId, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {InlineObject} [inlineObject] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        postFabricationProcesses(inlineObject?: InlineObject, options?: any): AxiosPromise<void> {
            return localVarFp.postFabricationProcesses(inlineObject, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * DefaultApi - object-oriented interface
 * @export
 * @class DefaultApi
 * @extends {BaseAPI}
 */
export class DefaultApi extends BaseAPI {
    /**
     * 
     * @param {string} fabricationProcessId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public deleteFabricationProcessesFabricationProcessId(fabricationProcessId: string, options?: any) {
        return DefaultApiFp(this.configuration).deleteFabricationProcessesFabricationProcessId(fabricationProcessId, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 論文一覧取得
     * @summary get databases
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public getDatabases(options?: any) {
        return DefaultApiFp(this.configuration).getDatabases(options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 論文一覧取得
     * @summary get Fabrication Processes
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public getFabricationProcesses(options?: any) {
        return DefaultApiFp(this.configuration).getFabricationProcesses(options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Get Papers
     * @summary Get Papers
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public getPapers(options?: any) {
        return DefaultApiFp(this.configuration).getPapers(options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Get Paper
     * @summary get paper
     * @param {string} paperId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public getPapersPaperId(paperId: string, options?: any) {
        return DefaultApiFp(this.configuration).getPapersPaperId(paperId, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {InlineObject} [inlineObject] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public postFabricationProcesses(inlineObject?: InlineObject, options?: any) {
        return DefaultApiFp(this.configuration).postFabricationProcesses(inlineObject, options).then((request) => request(this.axios, this.basePath));
    }
}


