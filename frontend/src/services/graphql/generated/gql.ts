/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  mutation Authenticate($input: AuthenticateInput!) {\n    authenticate(input: $input) {\n      accessToken\n      user {\n        id\n        name\n        email\n      }\n    }\n  }\n": typeof types.AuthenticateDocument,
    "\n  query GetMe {\n    me {\n      id\n      name\n      email\n    }\n  }\n": typeof types.GetMeDocument,
    "\n  mutation Register($input: RegisterInput!) {\n    register(input: $input) {\n      accessToken\n      user {\n        id\n        name\n        email\n      }\n    }\n  }\n": typeof types.RegisterDocument,
    "\n  mutation CreateCategory($input: CategoryInput!) {\n    createCategory(input: $input) {\n      id\n    }\n  }\n": typeof types.CreateCategoryDocument,
    "\n  mutation DeleteCategory($id: ID!) {\n    deleteCategory(id: $id)\n  }\n": typeof types.DeleteCategoryDocument,
    "\n  mutation EditCategory($id: ID!, $input: CategoryInput!) {\n    editCategory(id: $id, input: $input) {\n      id\n    }\n  }\n": typeof types.EditCategoryDocument,
    "\n  query GetCategories {\n    categories {\n      id\n      title\n      description\n      icon\n      color\n      transactionsCount\n      totalInCents\n    }\n  }\n": typeof types.GetCategoriesDocument,
    "\n  query GetFinancialSummary($month: Int!, $year: Int!) {\n    financialSummary(month: $month, year: $year) {\n      balanceInCents\n      monthIncomeInCents\n      monthExpenseInCents\n    }\n  }\n": typeof types.GetFinancialSummaryDocument,
    "\n  mutation EditProfile($input: EditProfileInput!) {\n    editProfile(input: $input) {\n      id\n      name\n      email\n    }\n  }\n": typeof types.EditProfileDocument,
    "\n  mutation CreateTransaction($input: TransactionInput!) {\n    createTransaction(input: $input) {\n      id\n    }\n  }\n": typeof types.CreateTransactionDocument,
    "\n  mutation DeleteTransaction($id: ID!) {\n    deleteTransaction(id: $id)\n  }\n": typeof types.DeleteTransactionDocument,
    "\n  mutation EditTransaction($id: ID!, $input: TransactionInput!) {\n    editTransaction(id: $id, input: $input) {\n      id\n    }\n  }\n": typeof types.EditTransactionDocument,
    "\n  query GetTransactions(\n    $filter: TransactionsFilter\n    $page: Int!\n    $perPage: Int!\n  ) {\n    transactions(filter: $filter, page: $page, perPage: $perPage) {\n      items {\n        id\n        description\n        amountInCents\n        type\n        date\n        category {\n          id\n          title\n          icon\n          color\n        }\n      }\n      total\n      page\n      perPage\n    }\n  }\n": typeof types.GetTransactionsDocument,
};
const documents: Documents = {
    "\n  mutation Authenticate($input: AuthenticateInput!) {\n    authenticate(input: $input) {\n      accessToken\n      user {\n        id\n        name\n        email\n      }\n    }\n  }\n": types.AuthenticateDocument,
    "\n  query GetMe {\n    me {\n      id\n      name\n      email\n    }\n  }\n": types.GetMeDocument,
    "\n  mutation Register($input: RegisterInput!) {\n    register(input: $input) {\n      accessToken\n      user {\n        id\n        name\n        email\n      }\n    }\n  }\n": types.RegisterDocument,
    "\n  mutation CreateCategory($input: CategoryInput!) {\n    createCategory(input: $input) {\n      id\n    }\n  }\n": types.CreateCategoryDocument,
    "\n  mutation DeleteCategory($id: ID!) {\n    deleteCategory(id: $id)\n  }\n": types.DeleteCategoryDocument,
    "\n  mutation EditCategory($id: ID!, $input: CategoryInput!) {\n    editCategory(id: $id, input: $input) {\n      id\n    }\n  }\n": types.EditCategoryDocument,
    "\n  query GetCategories {\n    categories {\n      id\n      title\n      description\n      icon\n      color\n      transactionsCount\n      totalInCents\n    }\n  }\n": types.GetCategoriesDocument,
    "\n  query GetFinancialSummary($month: Int!, $year: Int!) {\n    financialSummary(month: $month, year: $year) {\n      balanceInCents\n      monthIncomeInCents\n      monthExpenseInCents\n    }\n  }\n": types.GetFinancialSummaryDocument,
    "\n  mutation EditProfile($input: EditProfileInput!) {\n    editProfile(input: $input) {\n      id\n      name\n      email\n    }\n  }\n": types.EditProfileDocument,
    "\n  mutation CreateTransaction($input: TransactionInput!) {\n    createTransaction(input: $input) {\n      id\n    }\n  }\n": types.CreateTransactionDocument,
    "\n  mutation DeleteTransaction($id: ID!) {\n    deleteTransaction(id: $id)\n  }\n": types.DeleteTransactionDocument,
    "\n  mutation EditTransaction($id: ID!, $input: TransactionInput!) {\n    editTransaction(id: $id, input: $input) {\n      id\n    }\n  }\n": types.EditTransactionDocument,
    "\n  query GetTransactions(\n    $filter: TransactionsFilter\n    $page: Int!\n    $perPage: Int!\n  ) {\n    transactions(filter: $filter, page: $page, perPage: $perPage) {\n      items {\n        id\n        description\n        amountInCents\n        type\n        date\n        category {\n          id\n          title\n          icon\n          color\n        }\n      }\n      total\n      page\n      perPage\n    }\n  }\n": types.GetTransactionsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Authenticate($input: AuthenticateInput!) {\n    authenticate(input: $input) {\n      accessToken\n      user {\n        id\n        name\n        email\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation Authenticate($input: AuthenticateInput!) {\n    authenticate(input: $input) {\n      accessToken\n      user {\n        id\n        name\n        email\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetMe {\n    me {\n      id\n      name\n      email\n    }\n  }\n"): (typeof documents)["\n  query GetMe {\n    me {\n      id\n      name\n      email\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Register($input: RegisterInput!) {\n    register(input: $input) {\n      accessToken\n      user {\n        id\n        name\n        email\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation Register($input: RegisterInput!) {\n    register(input: $input) {\n      accessToken\n      user {\n        id\n        name\n        email\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateCategory($input: CategoryInput!) {\n    createCategory(input: $input) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation CreateCategory($input: CategoryInput!) {\n    createCategory(input: $input) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteCategory($id: ID!) {\n    deleteCategory(id: $id)\n  }\n"): (typeof documents)["\n  mutation DeleteCategory($id: ID!) {\n    deleteCategory(id: $id)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation EditCategory($id: ID!, $input: CategoryInput!) {\n    editCategory(id: $id, input: $input) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation EditCategory($id: ID!, $input: CategoryInput!) {\n    editCategory(id: $id, input: $input) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetCategories {\n    categories {\n      id\n      title\n      description\n      icon\n      color\n      transactionsCount\n      totalInCents\n    }\n  }\n"): (typeof documents)["\n  query GetCategories {\n    categories {\n      id\n      title\n      description\n      icon\n      color\n      transactionsCount\n      totalInCents\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetFinancialSummary($month: Int!, $year: Int!) {\n    financialSummary(month: $month, year: $year) {\n      balanceInCents\n      monthIncomeInCents\n      monthExpenseInCents\n    }\n  }\n"): (typeof documents)["\n  query GetFinancialSummary($month: Int!, $year: Int!) {\n    financialSummary(month: $month, year: $year) {\n      balanceInCents\n      monthIncomeInCents\n      monthExpenseInCents\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation EditProfile($input: EditProfileInput!) {\n    editProfile(input: $input) {\n      id\n      name\n      email\n    }\n  }\n"): (typeof documents)["\n  mutation EditProfile($input: EditProfileInput!) {\n    editProfile(input: $input) {\n      id\n      name\n      email\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateTransaction($input: TransactionInput!) {\n    createTransaction(input: $input) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation CreateTransaction($input: TransactionInput!) {\n    createTransaction(input: $input) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteTransaction($id: ID!) {\n    deleteTransaction(id: $id)\n  }\n"): (typeof documents)["\n  mutation DeleteTransaction($id: ID!) {\n    deleteTransaction(id: $id)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation EditTransaction($id: ID!, $input: TransactionInput!) {\n    editTransaction(id: $id, input: $input) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation EditTransaction($id: ID!, $input: TransactionInput!) {\n    editTransaction(id: $id, input: $input) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetTransactions(\n    $filter: TransactionsFilter\n    $page: Int!\n    $perPage: Int!\n  ) {\n    transactions(filter: $filter, page: $page, perPage: $perPage) {\n      items {\n        id\n        description\n        amountInCents\n        type\n        date\n        category {\n          id\n          title\n          icon\n          color\n        }\n      }\n      total\n      page\n      perPage\n    }\n  }\n"): (typeof documents)["\n  query GetTransactions(\n    $filter: TransactionsFilter\n    $page: Int!\n    $perPage: Int!\n  ) {\n    transactions(filter: $filter, page: $page, perPage: $perPage) {\n      items {\n        id\n        description\n        amountInCents\n        type\n        date\n        category {\n          id\n          title\n          icon\n          color\n        }\n      }\n      total\n      page\n      perPage\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;