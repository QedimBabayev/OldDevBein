const cols = [
  {
    dataField: "ProductName",
    text: "Name",
    classes: "nameField",
    sort: false,
    hidden: false,
  },
  {
    dataField: "BarCode",
    text: "BarCode",
    sort: false,
    hidden: false,
  },
  {
    dataField: "ArtCode",
    text: "ArtCode",
    sort: false,
    hidden: false,
  },
  {
    dataField: "Quantity",
    text: "Quantity",
    headerClasses: 'quantitysort',
    sort: true,
    hidden: false,
    showFooter: true,
    footerName: "QuantitySum",
    priceFormat: true,
  },
  {
    dataField: "CostPrice",
    text: "Cost Price",
    sort: false,
    hidden: false,
    priceFormat: true,
  },
  {
    dataField: "Amount",
    text: "Total Cost Price",
    sort: false,
    hidden: false,
    showFooter: true,
    footerName: "CostSum",
    priceFormat: true,
  },
  {
    dataField: "Price",
    text: "Product Price",
    sort: false,
    hidden: false,
    priceFormat: true,
  },
  {
    dataField: "TotalSumPrice",
    text: "Total Sum Price",
    sort: false,
    hidden: false,
    showFooter: true,
    footerName: "SaleSum",
    priceFormat: true,
  },
  {
    dataField: "BuyPrice",
    text: "BuyPrice",
    sort: false,
    hidden: true,
    priceFormat: true,
  },

  {
    dataField: "Moment",
    text: "Moment",
    sort: false,
    hidden: true,
  },
];

export default cols