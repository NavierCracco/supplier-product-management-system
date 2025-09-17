/***
  Provider Composition Pattern: Centralized context management architecture
  Strategic nesting order: ProductsProvider → ETL → File → SalesPanel
  Design ensures proper dependency hierarchy for cross-context integration
***/

import { FileProvider } from "../contexts/FileContext.jsx";
import { ProductsProvider } from "../contexts/ProductsContext.jsx";
import { SalesPanelProvider } from "../contexts/SalesPanelContext.jsx";
import { ETLProvider } from "../contexts/ETLContext.jsx";
import PropTypes from "prop-types";

const RootProvider = ({ children }) => {
  return (
    // Context hierarchy reflects data flow: Products → ETL → Files → Sales
    // Products at root level provides base data for all child contexts
    <ProductsProvider>
      <ETLProvider>
        <FileProvider>
          <SalesPanelProvider>{children}</SalesPanelProvider>
        </FileProvider>
      </ETLProvider>
    </ProductsProvider>
  );
};

export default RootProvider;

RootProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
