import { Route } from 'react-router';
import ExampleClient from '@/exampleRequest/ExampleClient';
import { lazy } from 'react';


const DetailProperty = lazy(() => import('@/pages/DetailProperty'));
const PageButton = lazy(() => import('@/pages/exampleComponents/PageButton'));
const Home = lazy(() => import('@/pages/Home'));
const SearchResults = lazy(() => import('@/pages/SearchResults'));
const SupportCenter = lazy(() => import('@/pages/SupportCenter'));

const PublicRoutes = () => {
  <Route>
    <Route index element={<Home />} />
    <Route path="support" element={<SupportCenter />} />
    <Route path="detail/:id" element={<DetailProperty />} />
    <Route path="login" element={<ExampleClient />} />
    <Route path="buttons" element={<PageButton />} />
    <Route path="search-results" element={<SearchResults />} />
  </Route>;
};

export default PublicRoutes;
