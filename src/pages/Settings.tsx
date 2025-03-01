import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { User, Settings as SettingsIcon } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const Settings = () => {
    const { user, profile, updateProfile } = useAuth();
    const { toast } = useToast();
    const [displayName, setDisplayName] = useState('');
    const [areaCode, setAreaCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (profile) {
            setDisplayName(profile.display_name || '');
            setAreaCode(profile.area_code || '');
        }
    }, [profile]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const updatedProfile = await updateProfile({
                display_name: displayName,
                area_code: areaCode,
            });

            if (updatedProfile) {
                toast({
                    title: 'Profile updated',
                    description: 'Your profile has been updated successfully.',
                    variant: 'default',
                });
            } else {
                toast({
                    title: 'Update failed',
                    description: 'There was an error updating your profile. Please try again.',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast({
                title: 'Update failed',
                description: 'There was an error updating your profile. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Get user initials for avatar
    const getUserInitials = () => {
        if (profile?.display_name) {
            return profile.display_name
                .split(' ')
                .map(name => name[0])
                .join('')
                .toUpperCase()
                .substring(0, 2);
        }

        if (user?.email) {
            return user.email.substring(0, 2).toUpperCase();
        }

        return 'U';
    };

    return (
        <Layout>
            <div className="container mx-auto py-10 px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                    <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Sidebar */}
                    <div className="md:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile</CardTitle>
                                <CardDescription>Manage your personal information</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center">
                                <Avatar className="h-24 w-24 mb-4 border-2 border-gray-200">
                                    <AvatarFallback className="bg-crisisBlue-100 text-crisisBlue-700 text-2xl">
                                        {getUserInitials()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="text-center">
                                    <h3 className="font-medium text-lg">{profile?.display_name || 'User'}</h3>
                                    <p className="text-gray-500 text-sm">{user?.email}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="md:col-span-2">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <SettingsIcon className="h-5 w-5 text-crisisBlue-600" />
                                    <CardTitle>Account Settings</CardTitle>
                                </div>
                                <CardDescription>Update your profile information and preferences</CardDescription>
                            </CardHeader>
                            <form onSubmit={handleSubmit}>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="displayName">Display Name</Label>
                                        <Input
                                            id="displayName"
                                            placeholder="Enter your name"
                                            value={displayName}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={user?.email || ''}
                                            disabled
                                            className="bg-gray-50"
                                        />
                                        <p className="text-xs text-gray-500">Email cannot be changed</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="areaCode">Zip Code</Label>
                                        <Input
                                            id="areaCode"
                                            placeholder="Enter your zip code (e.g., 08724)"
                                            value={areaCode}
                                            onChange={(e) => setAreaCode(e.target.value)}
                                        />
                                        <p className="text-xs text-gray-500">
                                            Your zip code helps us provide more relevant disaster predictions for your location
                                        </p>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-end">
                                    <Button type="submit" disabled={isLoading}>
                                        {isLoading ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Settings; 