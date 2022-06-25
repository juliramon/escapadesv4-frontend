import SVG from "react-inlinesvg";

const NavigationCategoryBox = ({ icon, slug, pluralName }) => {
  const upperName = pluralName.charAt(0).toUpperCase() + pluralName.slice(1);
  const svgIcon = <SVG src={icon} />;
  return (
    <div className="content-bar---item">
      <a href={`/${slug}`}>
        <div className="content-bar---col left">{svgIcon}</div>
        <div className="content-bar---col right">
          <p>{upperName}</p>
        </div>
      </a>
    </div>
  );
};

export default NavigationCategoryBox;
