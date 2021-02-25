import Link from "next/link";
import SVG from "react-inlinesvg";

const NavigationCategoryBox = ({ icon, slug, name }) => {
  const upperName = name.charAt(0).toUpperCase() + name.slice(1);
  const svgIcon = <SVG src={icon} />;
  console.log(svgIcon);

  return (
    <div className="content-bar---item">
      <Link href={`/${slug}`}>
        <a>
          <div className="content-bar---col left">{svgIcon}</div>
          <div className="content-bar---col right">
            <p>{upperName}</p>
          </div>
        </a>
      </Link>
    </div>
  );
};

export default NavigationCategoryBox;
