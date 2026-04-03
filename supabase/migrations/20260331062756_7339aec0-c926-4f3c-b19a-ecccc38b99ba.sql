
-- Fix admin policies to avoid infinite recursion
-- Create a security definer function for admin check
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = _user_id AND is_admin = true
  )
$$;

-- Drop recursive policies
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can read all feedback" ON public.feedback;

-- Recreate with security definer function
CREATE POLICY "Admins can read all profiles" ON public.profiles
  FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can read all feedback" ON public.feedback
  FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

-- Also let admins read all businesses
CREATE POLICY "Admins can read all businesses" ON public.businesses
  FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
