export const create = (sfc) => {
  sfc.properties = sfc.props;
  delete sfc.props;

  return Component(sfc);
}