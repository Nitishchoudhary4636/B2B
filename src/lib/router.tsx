import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useMemo,
  useState,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from "react";

type Params = Record<string, string>;

type RouteProps = {
  path: string;
  element: ReactNode;
};

type LocationLike = {
  pathname: string;
  search: string;
  hash: string;
};

type NavState = {
  isActive: boolean;
  isPending: boolean;
};

type To = string;

export type NavigateOptions = {
  replace?: boolean;
};

export type SetURLSearchParams = (
  nextInit:
    | URLSearchParams
    | string
    | string[][]
    | Record<string, string>
    | ((prev: URLSearchParams) => URLSearchParams),
  navigateOpts?: NavigateOptions,
) => void;

const LocationContext = createContext<LocationLike>(getLocationSnapshot());
const ParamsContext = createContext<Params>({});

function getLocationSnapshot(): LocationLike {
  return {
    pathname: normalizePath(window.location.pathname),
    search: window.location.search,
    hash: window.location.hash,
  };
}

function normalizePath(pathname: string): string {
  if (!pathname) return "/";
  if (pathname === "/") return "/";
  return pathname.replace(/\/+$/, "") || "/";
}

function splitPath(pathname: string): string[] {
  const normalized = normalizePath(pathname);
  if (normalized === "/") return [];
  return normalized.slice(1).split("/");
}

function matchPath(pattern: string, pathname: string): Params | null {
  if (pattern === "*") return {};

  const patternParts = splitPath(pattern);
  const pathParts = splitPath(pathname);

  if (patternParts.length !== pathParts.length) return null;

  const params: Params = {};

  for (let i = 0; i < patternParts.length; i += 1) {
    const currentPattern = patternParts[i];
    const currentValue = pathParts[i];
    if (currentPattern.startsWith(":")) {
      params[currentPattern.slice(1)] = decodeURIComponent(currentValue);
      continue;
    }
    if (currentPattern !== currentValue) return null;
  }

  return params;
}

function isModifiedEvent(event: MouseEvent<HTMLAnchorElement>) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

function shouldHandleClientNavigation(
  event: MouseEvent<HTMLAnchorElement>,
  target: string | undefined,
  download: boolean | undefined,
) {
  return event.button === 0 && !isModifiedEvent(event) && (!target || target === "_self") && !download;
}

function getPathnameFromTo(to: To): string {
  try {
    const parsed = new URL(to, window.location.origin);
    if (parsed.origin !== window.location.origin) return "";
    return normalizePath(parsed.pathname);
  } catch {
    return normalizePath(to.split("?")[0].split("#")[0]);
  }
}

export function BrowserRouter({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<LocationLike>(getLocationSnapshot());

  useEffect(() => {
    const sync = () => setLocation(getLocationSnapshot());
    window.addEventListener("popstate", sync);
    window.addEventListener("hashchange", sync);
    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener("hashchange", sync);
    };
  }, []);

  return <LocationContext.Provider value={location}>{children}</LocationContext.Provider>;
}

export function Route(_props: RouteProps) {
  return null;
}

export function Routes({ children }: { children: ReactNode }) {
  const location = useContext(LocationContext);
  const pathname = location.pathname;

  const match = useMemo(() => {
    const routeElements = Children.toArray(children).filter(isValidElement) as ReactElement<RouteProps>[];

    for (const routeElement of routeElements) {
      const params = matchPath(routeElement.props.path, pathname);
      if (params) {
        return { element: routeElement.props.element, params };
      }
    }
    return null;
  }, [children, pathname]);

  if (!match) return null;
  return <ParamsContext.Provider value={match.params}>{match.element}</ParamsContext.Provider>;
}

export type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  to: To;
};

export function Link({ to, onClick, ...props }: LinkProps) {
  return (
    <a
      href={to}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        if (!shouldHandleClientNavigation(event, props.target, props.download)) return;
      }}
      {...props}
    />
  );
}

export type NavLinkProps = Omit<LinkProps, "className"> & {
  className?: string | ((state: NavState) => string);
  end?: boolean;
};

export function NavLink({ to, className, end, ...props }: NavLinkProps) {
  const location = useContext(LocationContext);
  const targetPath = getPathnameFromTo(to);
  const currentPath = normalizePath(location.pathname);
  const isActive =
    currentPath === targetPath || (!end && targetPath !== "/" && currentPath.startsWith(`${targetPath}/`));

  const computedClassName =
    typeof className === "function"
      ? className({ isActive, isPending: false })
      : className;

  return <Link to={to} className={computedClassName} {...props} />;
}

export function useNavigate() {
  return (to: To | number, options?: NavigateOptions) => {
    if (typeof to === "number") {
      window.history.go(to);
      return;
    }
    if (options?.replace) {
      window.location.replace(to);
    } else {
      window.location.assign(to);
    }
  };
}

export function useParams<T extends Params = Params>(): T {
  return useContext(ParamsContext) as T;
}

export function useLocation(): LocationLike {
  return useContext(LocationContext);
}

export function useSearchParams(): [URLSearchParams, SetURLSearchParams] {
  const location = useLocation();
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const setSearchParams: SetURLSearchParams = (nextInit, navigateOpts) => {
    const nextValue =
      typeof nextInit === "function"
        ? nextInit(new URLSearchParams(window.location.search))
        : nextInit;
    const nextSearch = new URLSearchParams(nextValue as URLSearchParamsInit).toString();
    const nextHref = `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ""}${window.location.hash}`;
    if (navigateOpts?.replace) {
      window.location.replace(nextHref);
    } else {
      window.location.assign(nextHref);
    }
  };

  return [searchParams, setSearchParams];
}

export function Navigate({ to, replace }: { to: To; replace?: boolean }) {
  useEffect(() => {
    if (replace) {
      window.location.replace(to);
    } else {
      window.location.assign(to);
    }
  }, [replace, to]);

  return null;
}

type URLSearchParamsInit = ConstructorParameters<typeof URLSearchParams>[0];
