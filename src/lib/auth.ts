export function isAuthenticated(): boolean {
    const token = localStorage.getItem("token");
    return !!token;
  }
  
  export async function hasRole(requiredRole: string | string[]): Promise<boolean> {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return false;
  
    try {
      const user = JSON.parse(storedUser);
      const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      return roles.includes(user.role);
    } catch (error) {
      return false;
    }
  }
  